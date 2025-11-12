import React from 'react';
import { CheckCircleIcon } from './Icons';

const steps = [
  {
    number: "01",
    title: "Create Report",
    description: "Start with pre-loaded templates or let AI generate a structured draft from your event data.",
  },
  {
    number: "02",
    title: "Collaborate",
    description: "Multiple team members can co-edit in real-time with tracked contributions and suggestions.",
  },
  {
    number: "03",
    title: "Review & Refine",
    description: "AI writing feedback engine improves clarity, grammar, and tone to meet official standards.",
  },
  {
    number: "04",
    title: "Sign & Submit",
    description: "Apply digital signatures and automatically route to Zonal Coordinator and DG's Office.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-24 px-4 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full text-accent text-sm font-medium">
            Simple Process
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            How NIRMS Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to transform your reporting workflow
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="group relative"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex gap-6 p-8 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-medium transition-all duration-500">
                {/* Number */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-ocean flex items-center justify-center text-primary-foreground font-bold text-xl shadow-soft">
                      {step.number}
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gradient-to-b from-primary to-transparent mt-4" />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    {/* Fix: Replaced commented out 'CheckCircle' with 'CheckCircleIcon' from local Icons component. */}
                    <CheckCircleIcon className="w-6 h-6 text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-accent" />
            <span>Pilot launching at Abuja Zonal Office</span>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-accent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;