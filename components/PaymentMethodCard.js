// components/PaymentMethodCard.js
import React from "react";
import Image from "next/image";

const PaymentMethodCard = ({ method, isSelected, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className={`
        relative p-4 rounded-xl border transition-all duration-300 cursor-pointer
        ${
          isSelected
            ? "bg-white/10 border-yellow-500 shadow-lg shadow-yellow-500/10"
            : "bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20"
        }
      `}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
          {method.icon ? (
            <Image
              src={`/images/payment/${method.icon}`}
              alt={method.name}
              width={32}
              height={32}
              className="object-contain"
            />
          ) : (
            <div className="text-gray-800 font-bold text-lg">
              {method.name.charAt(0)}
            </div>
          )}
        </div>
        <div className="font-medium text-white">{method.name}</div>
      </div>

      <p className="text-white/60 text-sm">{method.description}</p>

      {isSelected && (
        <div className="absolute top-2 left-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodCard;
