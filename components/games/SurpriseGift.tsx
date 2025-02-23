export default function SurpriseGift({ score }: { score: number }) {
    const gifts = ["🎁 Bonus Hint", "🎊 Special Badge", "🛍 Mystery Coupon"];
    const gift = score >= 20 ? gifts[Math.floor(Math.random() * gifts.length)] : "😢 Try Again!";
  
    return (
      <div className="bg-gray-900 p-6 rounded-lg text-center">
        <h2 className="text-xl text-yellow-400 font-bold">🎉 Surprise Reward!</h2>
        <p className="text-lg text-white mt-2">{gift}</p>
      </div>
    );
  }
  