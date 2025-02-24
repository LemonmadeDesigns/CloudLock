import React, { useState } from 'react';
import { 
  KeyIcon, ShieldCheckIcon, BrainCircuitIcon, SmartphoneIcon, 
  AlertTriangleIcon, GlobeIcon, ShieldAlertIcon, XIcon
} from 'lucide-react';

interface TutorialStep {
  title: string;
  description: string;
  icon: React.ElementType;
  image: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: 'Welcome to Your Password Vault',
    description: 'Your vault is where all your passwords are securely stored. Click "Add Password" to save your first credential.',
    icon: KeyIcon,
    image: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Save Passwords Securely',
    description: 'Add your username, password, and optional details. CloudLock will automatically analyze your password strength.',
    icon: ShieldCheckIcon,
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'AI Password Analysis',
    description: 'Our AI analyzes your passwords in real-time, suggesting improvements and detecting potential vulnerabilities.',
    icon: BrainCircuitIcon,
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Multi-Factor Authentication',
    description: 'Enable MFA for an extra layer of security. Use your phone or security key as a second factor.',
    icon: SmartphoneIcon,
    image: 'https://images.unsplash.com/photo-1616499370260-485b3e5ed653?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Emergency Self-Destruct',
    description: 'In case of a security breach, activate the emergency self-destruct to immediately wipe your vault.',
    icon: AlertTriangleIcon,
    image: 'https://images.unsplash.com/photo-1614064642639-e398cf05badb?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Dark Web Monitoring',
    description: 'CloudLock continuously monitors the dark web for your credentials and alerts you of any potential breaches.',
    icon: GlobeIcon,
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: 'Phishing Protection',
    description: "Our AI detects and warns you about potential phishing attempts when you're about to use your passwords.",
    icon: ShieldAlertIcon,
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&auto=format&fit=crop&q=80'
  }
];

interface TutorialProps {
  onClose: () => void;
}

export function Tutorial({ onClose }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setImageLoaded(false);
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const step = tutorialSteps[currentStep];
  const Icon = step.icon;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div className="relative w-full max-w-4xl mx-4">
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 z-10"
          >
            <XIcon className="w-6 h-6" />
          </button>

          <div className="flex flex-col md:flex-row">
            {/* Left side - Image */}
            <div className="w-full md:w-1/2">
              <div className="relative h-48 md:h-full">
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                <img
                  src={step.image}
                  alt={step.title}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </div>

            {/* Right side - Content */}
            <div className="w-full md:w-1/2 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{step.title}</h2>
              </div>

              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                {step.description}
              </p>

              {/* Progress indicators */}
              <div className="flex items-center gap-2 mb-8">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentStep
                        ? 'w-8 bg-blue-600'
                        : index < currentStep
                        ? 'w-2 bg-blue-600'
                        : 'w-2 bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={handleClose}
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
                >
                  Skip tutorial
                </button>
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  {currentStep === tutorialSteps.length - 1 ? 'Get Started' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}