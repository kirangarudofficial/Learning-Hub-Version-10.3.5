import React, { useState } from 'react';
import { Check, Crown } from 'lucide-react';
import { plans } from '../data/pricingData';

export default function PricingPlans() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Choose Your Learning Plan
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Flexible pricing options to fit your learning goals and budget
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-full p-1 shadow-lg">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                !isAnnual 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-200 relative ${
                isAnnual 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Save 35%
              </span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const price = isAnnual ? plan.price.annual : plan.price.monthly;
            
            return (
              <div 
                key={plan.name}
                className={`bg-white rounded-2xl shadow-xl p-8 relative transform hover:-translate-y-2 transition-all duration-300 border-2 ${plan.color} ${
                  plan.popular ? 'scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center space-x-1">
                      <Crown className="w-4 h-4" />
                      <span>Most Popular</span>
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                    plan.name === 'Free Access' ? 'bg-gray-100 text-gray-600' :
                    plan.name === 'LearnHub Plus' ? 'bg-blue-100 text-blue-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold text-gray-800">
                        ${price}
                      </span>
                      {price > 0 && (
                        <span className="text-gray-600 ml-2">
                          /{isAnnual ? 'month' : 'month'}
                        </span>
                      )}
                    </div>
                    {isAnnual && price > 0 && (
                      <p className="text-sm text-green-600 font-medium mt-1">
                        Billed annually (${price * 12}/year)
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <div className="bg-green-100 rounded-full p-1 mt-0.5">
                        <Check className="w-3 h-3 text-green-600" />
                      </div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.limitations.map((limitation, limitIndex) => (
                    <div key={limitIndex} className="flex items-start space-x-3 opacity-60">
                      <div className="bg-gray-100 rounded-full p-1 mt-0.5">
                        <span className="w-3 h-3 text-gray-400 text-xs flex items-center justify-center">×</span>
                      </div>
                      <span className="text-gray-500 text-sm">{limitation}</span>
                    </div>
                  ))}
                </div>

                <button className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 ${
                  plan.name === 'Free Access' 
                    ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' :
                  plan.name === 'LearnHub Plus'
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg' :
                    'bg-purple-600 text-white hover:bg-purple-700 shadow-lg'
                }`}>
                  {plan.cta}
                </button>

                {plan.name === 'LearnHub Plus' && (
                  <p className="text-center text-sm text-gray-500 mt-3">
                    7-day free trial • Cancel anytime
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Frequently Asked Questions
            </h3>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Can I switch plans anytime?</h4>
                <p className="text-gray-600 text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">What's included in the free trial?</h4>
                <p className="text-gray-600 text-sm">Full access to all LearnHub Plus features for 7 days. No credit card required.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Do you offer student discounts?</h4>
                <p className="text-gray-600 text-sm">Yes! Students get 50% off all paid plans with valid student ID verification.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">What payment methods do you accept?</h4>
                <p className="text-gray-600 text-sm">We accept all major credit cards, PayPal, and bank transfers for enterprise plans.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}