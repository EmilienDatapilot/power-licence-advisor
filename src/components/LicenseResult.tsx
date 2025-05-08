
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircleIcon, InfoIcon, CalendarIcon } from 'lucide-react';

interface LicenseRecommendation {
  name: string;
  description: string;
  reasons: string[];
  alternative?: {
    name: string;
    reason: string;
  };
}

interface LicenseResultProps {
  recommendation: LicenseRecommendation;
}

// Fonction pour déterminer la couleur de fond selon la licence
const getLicenseColor = (licenseName: string): string => {
  const lowerCaseName = licenseName.toLowerCase();
  
  if (lowerCaseName.includes('free')) return 'bg-gradient-to-br from-bleu-tres-clair to-bleu/5';
  if (lowerCaseName.includes('pro')) return 'bg-gradient-to-br from-bleu-tres-clair to-bleu/20';
  if (lowerCaseName.includes('premium') || lowerCaseName.includes('per user')) return 'bg-gradient-to-br from-jaune/10 to-jaune/30';
  if (lowerCaseName.includes('embedded')) return 'bg-gradient-to-br from-rouge/10 to-rouge/30';
  if (lowerCaseName.includes('fabric') || lowerCaseName.includes('capacité')) return 'bg-gradient-to-br from-bleu/20 to-bleu/40';
  
  return 'bg-bleu-tres-clair';
};

const LicenseResult: React.FC<LicenseResultProps> = ({ recommendation }) => {
  const handleReset = () => {
    window.location.reload();
  };

  const handleScheduleMeeting = () => {
    // Logique pour prendre RDV (redirection vers un calendrier, etc.)
    alert("Redirection vers la page de prise de RDV");
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <Card className="overflow-hidden border-2 border-bleu shadow-lg">
        <CardHeader className={`${getLicenseColor(recommendation.name)} p-6`}>
          <Badge className="w-fit mb-2 bg-bleu text-white hover:bg-bleu-fonce">Recommandation</Badge>
          <CardTitle className="text-2xl font-bold text-bleu-tres-fonce">{recommendation.name}</CardTitle>
          <CardDescription className="text-base text-gray-700">{recommendation.description}</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-bleu-fonce mb-2 flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-bleu" />
              Pourquoi cette recommandation
            </h3>
            <ul className="space-y-2 pl-6">
              {recommendation.reasons.map((reason, index) => (
                <li key={index} className="text-gray-700 list-disc">
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          {recommendation.alternative && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-bleu-fonce mb-2 flex items-center gap-2">
                <InfoIcon className="h-5 w-5 text-jaune" />
                Alternative à considérer
              </h3>
              <div className="bg-gradient-to-br from-bleu-tres-clair to-white p-4 rounded-md border border-jaune/20">
                <p className="font-medium text-bleu-tres-fonce">{recommendation.alternative.name}</p>
                <p className="text-gray-600 text-sm mt-1">{recommendation.alternative.reason}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informations complémentaires */}
      <Card className="border-bleu border-opacity-20 bg-gradient-to-br from-white to-bleu-tres-clair/30 shadow-md">
        <CardContent className="p-6">
          <h3 className="font-medium text-bleu-fonce mb-2">Informations complémentaires</h3>
          <p className="text-gray-600 text-sm">
            Cette recommandation est basée sur les critères fournis dans le simulateur. 
            Pour une analyse plus détaillée, n'hésitez pas à contacter notre équipe qui sera en mesure de vous fournir des estimations de prix.
          </p>
        </CardContent>
      </Card>

      {/* Boutons d'action */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
        <Button 
          onClick={handleScheduleMeeting} 
          className="bg-bleu hover:bg-bleu-fonce text-white px-6 py-2 rounded-full shadow-md transition-all transform hover:scale-105"
        >
          <CalendarIcon className="h-5 w-5 mr-2" />
          Prendre RDV
        </Button>
        <Button 
          onClick={handleReset} 
          variant="outline"
          className="border-2 border-rouge text-rouge hover:bg-rouge/10 px-6 py-2 rounded-full"
        >
          Nouvelle recommandation
        </Button>
      </div>
    </div>
  );
};

export default LicenseResult;
