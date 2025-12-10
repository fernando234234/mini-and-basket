"use client";

import { useState } from "react";

interface AccordionItem {
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
  title?: string;
  icon?: string;
}

export default function Accordion({ items, title, icon }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {/* Section Title */}
      {title && (
        <div className="flex items-center gap-3 mb-6">
          {icon && <span className="text-2xl">{icon}</span>}
          <h3 className="text-xl font-bold text-brand-dark">{title}</h3>
        </div>
      )}

      {/* Accordion Items */}
      <div className="space-y-3">
        {items.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 ${
                isOpen
                  ? "shadow-lg ring-2 ring-brand-green/20"
                  : "shadow-md hover:shadow-lg"
              }`}
            >
              {/* Question Button */}
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left group"
              >
                <span
                  className={`font-semibold transition-colors duration-300 ${
                    isOpen ? "text-brand-green" : "text-brand-dark group-hover:text-brand-green"
                  }`}
                >
                  {item.question}
                </span>

                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isOpen
                      ? "bg-brand-green text-white rotate-180"
                      : "bg-gray-100 text-brand-gray group-hover:bg-brand-green/10 group-hover:text-brand-green"
                  }`}
                >
                  <svg
                    className="w-5 h-5 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {/* Answer */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-out ${
                  isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-5">
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-brand-gray leading-relaxed pt-4">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}