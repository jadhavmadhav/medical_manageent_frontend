// "use client";

// import { cn } from "@/lib/utils";

// interface StepperProps {
//   steps: { id: string; name: string }[];
//   activeStep: number;
//   setActiveStep: (step: number) => void;
//   className?: string;
// }

// export const Stepper = ({ steps, activeStep, setActiveStep, className }: StepperProps) => {
//   return (
//     <div className={cn("w-full mb-8", className)}>
//       <div className="flex items-center justify-between relative">
//         {/* Progress line background */}
//         <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gray-100 -z-10 rounded-full"></div>
        
//         {/* Progress line fill */}
//         <div 
//           className="absolute top-1/2 left-0 h-1.5 bg-primary transition-all duration-500 ease-in-out rounded-full"
//           style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
//         ></div>
        
//         {steps.map((step, index) => (
//           <div key={step.id} className="flex flex-col items-center">
//             <button
//               onClick={() => activeStep > index && setActiveStep(index)}
//               className={cn(
//                 "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
//                 "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
//                 activeStep > index 
//                   ? "bg-primary border-primary text-white shadow-sm" 
//                   : activeStep === index
//                     ? "bg-white border-primary text-primary shadow-md"
//                     : "bg-white border-gray-200 text-gray-400",
//               )}
//             >
//               {activeStep > index ? (
//                 <svg 
//                   className="w-5 h-5" 
//                   viewBox="0 0 20 20" 
//                   fill="currentColor"
//                   aria-hidden="true"
//                 >
//                   <path 
//                     fillRule="evenodd" 
//                     d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
//                     clipRule="evenodd" 
//                   />
//                 </svg>
//               ) : (
//                 <span className="font-medium">{index + 1}</span>
//               )}
//             </button>
//             <span 
//               className={cn(
//                 "mt-2 text-sm font-medium transition-colors",
//                 activeStep >= index ? "text-primary" : "text-gray-500"
//               )}
//             >
//               {step.name}
//             </span>
//             {activeStep === index && (
//               <span className="sr-only">Current step: {step.name}</span>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };




"use client";

import { cn } from "@/lib/utils";

interface StepperProps {
  steps: { id: string; name: string }[];
  activeStep: number;
  setActiveStep: (step: number) => void;
  className?: string;
}

export const Stepper = ({ steps, activeStep, setActiveStep, className }: StepperProps) => {
  return (
    <div className={cn("w-full mb-10 px-4 sm:px-6", className)}>
      <div className="relative flex items-center justify-between">
        {/* Progress line background */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full -z-10"></div>
        
        {/* Progress line fill */}
        <div 
          className="absolute top-5 left-0 h-1 bg-blue-600 transition-all duration-300 ease-in-out rounded-full"
          style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
        ></div>
        
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative z-10">
            <button
              onClick={() => activeStep >= index && setActiveStep(index)}
              disabled={activeStep < index}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                "disabled:cursor-not-allowed",
                activeStep > index 
                  ? "bg-blue-600 border-blue-600 text-white shadow-sm" 
                  : activeStep === index
                    ? "bg-white border-blue-600 text-blue-600 shadow-md"
                    : "bg-white border-gray-300 text-gray-400"
              )}
              aria-current={activeStep === index ? "step" : undefined}
              aria-label={`Step ${index + 1}: ${step.name}`}
            >
              {activeStep > index ? (
                <svg 
                  className="w-5 h-5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              ) : (
                <span className="text-sm font-semibold">{index + 1}</span>
              )}
            </button>
            <span 
              className={cn(
                "mt-3 text-xs font-medium tracking-wide",
                activeStep >= index ? "text-blue-600" : "text-gray-500"
              )}
            >
              {step.name}
            </span>
            {activeStep === index && (
              <span className="sr-only">Current step: {step.name}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};