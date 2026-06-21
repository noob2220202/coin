// 서버 전용 모듈 — API 키는 process.env.FEEE_API_KEY (NEXT_PUBLIC 미사용)
// src/app/api/energy/** 라우트 핸들러에서만 import 할 것
// 공식 문서: https://feee.io/open (V2)
// 참고: Feee.io는 사이트 운영자의 선충전 TRX 잔액(API 키에 연결된 플랫폼 잔액)에서
// 차감되는 구조라서 TronNRG의 payer 개념이 없음
const BASE = 'https://feee.io/open'
const USER_AGENT = 'CottonCandyCoin/1.0.0 (https://feee.io)'

// 가격 조회용 기준 에너지량 (Feee.io 최소 주문량이 32000이라 그 아래로는 조회 자체가 거부됨)
const REFERENCE_ENERGY = 32000

function getKey(): string {
  const key = process.env.FEEE_API_KEY
  if (!key) throw new Error('FEEE_API_KEY가 설정되지 않았습니다')
  return key
}

interface FeeeResponse<T> {
  code: number
  msg: string
  request_id: string
  data: T
}

async function feeeFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      key: getKey(),
      'User-Agent': USER_AGENT,
      ...init?.headers,
    },
  })
  const json: FeeeResponse<T> = await res.json()
  if (json.code !== 0) {
    throw new Error(json.msg || 'Feee.io API 오류')
  }
  return json.data
}

interface FeeeOrderDetail {
  order_no: string
  resource_type: number
  receive_address: string
  price_in_sun: number
  resource_value: number
  rent_duration: number
  rent_time_unit: string
  frozen_tx_id: string
  pay_amount: number
  refund_amount: number
  status: number
  business_status?: number
  sub_order?: FeeeOrderDetail[]
}

interface FeeePriceData {
  resource_value: number
  pay_amount: number
  service_amount: number
  rent_duration: number
  rent_time_unit: string
  price_in_sun: number
}

interface FeeeResourceData {
  energy: number
  bandwidth: number
}

// 주문이 실제로 체인에 위임(delegate)되었는지를 frozen_tx_id/refund_amount로 추론
// (Feee.io 문서에 status 코드표가 없어 가장 신뢰할 수 있는 필드로 판단)
function resolveStatus(detail: FeeeOrderDetail): string {
  if (detail.refund_amount > 0) return 'refunded'
  const delegated =
    !!detail.frozen_tx_id || (detail.sub_order?.some((o) => !!o.frozen_tx_id) ?? false)
  return delegated ? 'completed' : 'pending'
}

// 현재 에너지 가격 (1만 에너지 / 1일 기준)
export async function getEnergyPrice() {
  const [priceData, resourceData] = await Promise.all([
    feeeFetch<FeeePriceData>(
      `/v2/order/price?resource_value=${REFERENCE_ENERGY}&rent_duration=1&rent_time_unit=d`
    ),
    feeeFetch<FeeeResourceData>('/v2/api/resource'),
  ])
  return {
    price_trx: priceData.pay_amount,
    price_sun: priceData.price_in_sun,
    available: resourceData.energy,
    reference_energy: REFERENCE_ENERGY,
  }
}

// 임대 견적 계산 (duration: 일 단위)
export async function getEnergyQuote(energyAmount: number, duration: number) {
  const data = await feeeFetch<FeeePriceData>(
    `/v2/order/price?resource_value=${energyAmount}&rent_duration=${duration}&rent_time_unit=d`
  )
  return {
    total_trx: data.pay_amount,
    total_sun: data.price_in_sun,
  }
}

// 에너지 임대 실행
export async function rentEnergy(params: {
  receiver: string // 받을 트론 주소
  energy: number // 에너지 양
  duration: number // 일수
}) {
  const data = await feeeFetch<FeeeOrderDetail>('/v2/order/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      resource_type: 1,
      receive_address: params.receiver,
      resource_value: params.energy,
      rent_duration: params.duration,
      rent_time_unit: 'd',
    }),
  })
  return {
    orderNo: data.order_no,
    payAmount: data.pay_amount,
    status: resolveStatus(data),
  }
}

// 주문 상태 조회
export async function getOrderStatus(orderNo: string) {
  const data = await feeeFetch<FeeeOrderDetail>(
    `/v2/order/query?order_no=${encodeURIComponent(orderNo)}`
  )
  return {
    orderNo: data.order_no,
    payAmount: data.pay_amount,
    status: resolveStatus(data),
  }
}
