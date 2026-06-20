'use client'

export default function BlobBackground() {
  return (
    <div className="blob-bg">
      <div
        className="blob w-[500px] h-[500px] bg-candy-pink top-[-100px] left-[-100px]"
        style={{ animationDelay: '0s' }}
      />
      <div
        className="blob w-[600px] h-[600px] bg-candy-lav top-[30%] right-[-150px]"
        style={{ animationDelay: '-4s' }}
      />
      <div
        className="blob w-[400px] h-[400px] bg-candy-mint bottom-[10%] left-[20%]"
        style={{ animationDelay: '-8s' }}
      />
      <div
        className="blob w-[350px] h-[350px] bg-candy-peach bottom-[-50px] right-[30%]"
        style={{ animationDelay: '-2s' }}
      />
    </div>
  )
}
