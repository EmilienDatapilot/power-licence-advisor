
import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UsersIcon, SlackIcon, ActivityIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import LicenseResult from './LicenseResult';

// Types pour les données du formulaire et le résultat
interface FormData {
  userCount: number;
  intensity: 'faible' | 'normal' | 'intensif';
  features: {
    embedded: boolean;
    cicd: boolean;
    frequent_refresh: boolean;
    deployment_pipelines: boolean;
    web_publishing: boolean;
    advanced_analytics: boolean;
  };
}

interface LicenseRecommendation {
  name: string;
  description: string;
  reasons: string[];
  alternative?: {
    name: string;
    reason: string;
  };
}

const LicenseAdvisor = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    userCount: 10,
    intensity: 'normal',
    features: {
      embedded: false,
      cicd: false,
      frequent_refresh: false,
      deployment_pipelines: false,
      web_publishing: false,
      advanced_analytics: false,
    },
  });
  const [recommendation, setRecommendation] = useState<LicenseRecommendation | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Gestion des changements de valeurs
  const handleUserCountChange = (value: number[]) => {
    setFormData({ ...formData, userCount: value[0] });
  };

  const handleIntensityChange = (value: 'faible' | 'normal' | 'intensif') => {
    setFormData({ ...formData, intensity: value });
  };

  const handleFeatureChange = (feature: keyof FormData['features'], checked: boolean) => {
    setFormData({
      ...formData,
      features: {
        ...formData.features,
        [feature]: checked,
      },
    });
  };

  // Logique de recommandation
  const generateRecommendation = (): void => {
    const { userCount, intensity, features } = formData;
    let recommendation: LicenseRecommendation = {
      name: '',
      description: '',
      reasons: [],
    };

    // Licence Embedded (priorité la plus élevée)
    if (features.embedded) {
      recommendation = {
        name: 'Power BI Embedded',
        description: 'Solution pour intégrer des analyses Power BI dans vos propres applications.',
        reasons: [
          'Vous avez sélectionné la marque blanche / reporting embarqué',
          'Cette licence est spécifiquement conçue pour l\'intégration dans vos applications'
        ],
      };
    }
    // Licence Fabric (capacité)
    else if (userCount > 50 || (intensity === 'intensif' && 
            (features.cicd || features.deployment_pipelines || features.frequent_refresh || features.advanced_analytics))) {
      recommendation = {
        name: 'Microsoft Fabric (capacité)',
        description: 'Solution complète d\'analyse de données avec capacité dédiée pour entreprises.',
        reasons: [
          userCount > 50 ? 'Vous avez plus de 50 utilisateurs' : 'Vous avez une utilisation intensive',
          'Cette licence offre des performances optimales pour les grands groupes d\'utilisateurs',
          'Inclut toutes les fonctionnalités premium de Power BI'
        ],
      };

      // Alternative si le nombre d'utilisateurs est proche de 50
      if (userCount >= 40 && userCount <= 60) {
        recommendation.alternative = {
          name: 'Power BI Premium Per User',
          reason: 'Si le nombre exact d\'utilisateurs est flexible ou si vous préférez un modèle par utilisateur plutôt que par capacité.'
        };
      }
    }
    // Power BI Premium Per User
    else if (userCount <= 50 && (features.cicd || features.deployment_pipelines || features.frequent_refresh || features.advanced_analytics)) {
      recommendation = {
        name: 'Power BI Premium Per User',
        description: 'Licence premium avec fonctionnalités avancées attribuée par utilisateur.',
        reasons: [
          'Vous avez besoin de fonctionnalités premium',
          'Vous avez moins de 50 utilisateurs',
          'Cette licence offre toutes les fonctionnalités premium sur une base par utilisateur'
        ],
      };
    }
    // Power BI Pro
    else if ((userCount > 1 && userCount <= 10) || features.web_publishing) {
      recommendation = {
        name: 'Power BI Pro',
        description: 'Licence standard pour le partage et la collaboration dans Power BI.',
        reasons: [
          'Vous avez entre 1 et 10 utilisateurs',
          features.web_publishing ? 'Vous avez besoin de publier des rapports en ligne' : 'Vous avez des besoins de collaboration modérés',
          'Cette licence offre les principales fonctionnalités de collaboration et de partage'
        ],
      };

      // Alternative si les besoins sont plus avancés
      if (intensity === 'normal' && userCount > 5) {
        recommendation.alternative = {
          name: 'Power BI Premium Per User',
          reason: 'Si vous prévoyez d\'augmenter votre utilisation ou d\'avoir besoin de fonctionnalités premium à l\'avenir.'
        };
      }
    }
    // Power BI Free
    else if (userCount === 1 && intensity === 'faible' && !features.web_publishing) {
      recommendation = {
        name: 'Power BI Free',
        description: 'Licence gratuite avec des fonctionnalités de base pour un usage personnel.',
        reasons: [
          'Vous êtes un utilisateur unique',
          'Vous avez une utilisation faible',
          'Vous n\'avez pas besoin de publier des rapports en ligne'
        ],
      };
    }
    // Par défaut, si aucun cas n'est rencontré
    else {
      recommendation = {
        name: 'Power BI Pro',
        description: 'Licence standard recommandée par défaut pour la plupart des cas d\'utilisation.',
        reasons: [
          'Cette licence offre un bon équilibre entre fonctionnalités et coût',
          'Convient à la majorité des scénarios d\'usage professionnel'
        ],
      };
    }

    setRecommendation(recommendation);
    setShowResult(true);
    
    toast({
      title: "Recommandation générée",
      description: `Licence recommandée : ${recommendation.name}`,
    });
  };

  const handleReset = () => {
    setFormData({
      userCount: 10,
      intensity: 'normal',
      features: {
        embedded: false,
        cicd: false,
        frequent_refresh: false,
        deployment_pipelines: false,
        web_publishing: false,
        advanced_analytics: false,
      },
    });
    setRecommendation(null);
    setShowResult(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-bleu-tres-fonce mb-2">
          Conseiller de Licence Power BI / Fabric
        </h2>
        <p className="text-gray-600">
          Trouvez la licence Microsoft Power BI ou Fabric qui correspond le mieux à vos besoins
        </p>
      </div>

      {!showResult ? (
        <div className="space-y-8 animate-fade-in">
          {/* Nombre d'utilisateurs */}
          <Card className="overflow-hidden border-bleu border-opacity-20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <UsersIcon className="h-6 w-6 text-bleu" />
                <h3 className="text-xl font-semibold text-bleu-tres-fonce">Nombre d'utilisateurs</h3>
              </div>
              <div className="space-y-6 pt-2">
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">1</span>
                    <span className="font-medium text-bleu-fonce">{formData.userCount}</span>
                    <span className="text-sm text-gray-500">200</span>
                  </div>
                  <Slider 
                    value={[formData.userCount]} 
                    min={1} 
                    max={200} 
                    step={1} 
                    onValueChange={handleUserCountChange}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Intensité d'utilisation */}
          <Card className="overflow-hidden border-bleu border-opacity-20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <ActivityIcon className="h-6 w-6 text-bleu" />
                <h3 className="text-xl font-semibold text-bleu-tres-fonce">Intensité d'utilisation</h3>
              </div>
              <div className="pt-2">
                <RadioGroup value={formData.intensity} onValueChange={(value: any) => handleIntensityChange(value)} className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center space-x-2 bg-bleu-tres-clair hover:bg-opacity-90 transition-all p-4 rounded-md flex-1 cursor-pointer">
                    <RadioGroupItem id="faible" value="faible" className="text-bleu" />
                    <Label htmlFor="faible" className="cursor-pointer font-medium">Faible</Label>
                    <p className="text-xs text-gray-500 ml-6">Peu de rapports, consultations occasionnelles</p>
                  </div>
                  <div className="flex items-center space-x-2 bg-bleu-tres-clair hover:bg-opacity-90 transition-all p-4 rounded-md flex-1 cursor-pointer">
                    <RadioGroupItem id="normal" value="normal" className="text-bleu" />
                    <Label htmlFor="normal" className="cursor-pointer font-medium">Normal</Label>
                    <p className="text-xs text-gray-500 ml-6">Utilisation régulière, nombre modéré de rapports</p>
                  </div>
                  <div className="flex items-center space-x-2 bg-bleu-tres-clair hover:bg-opacity-90 transition-all p-4 rounded-md flex-1 cursor-pointer">
                    <RadioGroupItem id="intensif" value="intensif" className="text-bleu" />
                    <Label htmlFor="intensif" className="cursor-pointer font-medium">Intensif</Label>
                    <p className="text-xs text-gray-500 ml-6">Nombreux rapports, consultations fréquentes</p>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Fonctionnalités */}
          <Card className="overflow-hidden border-bleu border-opacity-20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <SlackIcon className="h-6 w-6 text-bleu" />
                <h3 className="text-xl font-semibold text-bleu-tres-fonce">Fonctionnalités requises</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start space-x-3 bg-bleu-tres-clair p-4 rounded-md">
                  <Checkbox 
                    id="embedded" 
                    checked={formData.features.embedded}
                    onCheckedChange={(checked) => handleFeatureChange('embedded', checked as boolean)}
                    className="mt-1 text-bleu border-bleu"
                  />
                  <div className="space-y-1">
                    <Label htmlFor="embedded" className="font-medium cursor-pointer">Marque blanche / Embedded reporting</Label>
                    <p className="text-xs text-gray-500">Pour intégrer Power BI dans vos applications</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-bleu-tres-clair p-4 rounded-md">
                  <Checkbox 
                    id="cicd" 
                    checked={formData.features.cicd}
                    onCheckedChange={(checked) => handleFeatureChange('cicd', checked as boolean)}
                    className="mt-1 text-bleu border-bleu"
                  />
                  <div className="space-y-1">
                    <Label htmlFor="cicd" className="font-medium cursor-pointer">CI/CD (intégration continue)</Label>
                    <p className="text-xs text-gray-500">Pour automatiser le déploiement de rapports</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-bleu-tres-clair p-4 rounded-md">
                  <Checkbox 
                    id="frequent_refresh" 
                    checked={formData.features.frequent_refresh}
                    onCheckedChange={(checked) => handleFeatureChange('frequent_refresh', checked as boolean)}
                    className="mt-1 text-bleu border-bleu"
                  />
                  <div className="space-y-1">
                    <Label htmlFor="frequent_refresh" className="font-medium cursor-pointer">Mises à jour très fréquentes</Label>
                    <p className="text-xs text-gray-500">Refresh des données plusieurs fois par jour</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-bleu-tres-clair p-4 rounded-md">
                  <Checkbox 
                    id="deployment_pipelines" 
                    checked={formData.features.deployment_pipelines}
                    onCheckedChange={(checked) => handleFeatureChange('deployment_pipelines', checked as boolean)}
                    className="mt-1 text-bleu border-bleu"
                  />
                  <div className="space-y-1">
                    <Label htmlFor="deployment_pipelines" className="font-medium cursor-pointer">Pipelines de déploiement</Label>
                    <p className="text-xs text-gray-500">Pour gérer le cycle de vie des rapports</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-bleu-tres-clair p-4 rounded-md">
                  <Checkbox 
                    id="web_publishing" 
                    checked={formData.features.web_publishing}
                    onCheckedChange={(checked) => handleFeatureChange('web_publishing', checked as boolean)}
                    className="mt-1 text-bleu border-bleu"
                  />
                  <div className="space-y-1">
                    <Label htmlFor="web_publishing" className="font-medium cursor-pointer">Publication en ligne (web)</Label>
                    <p className="text-xs text-gray-500">Pour partager des rapports sur le web</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-bleu-tres-clair p-4 rounded-md">
                  <Checkbox 
                    id="advanced_analytics" 
                    checked={formData.features.advanced_analytics}
                    onCheckedChange={(checked) => handleFeatureChange('advanced_analytics', checked as boolean)}
                    className="mt-1 text-bleu border-bleu"
                  />
                  <div className="space-y-1">
                    <Label htmlFor="advanced_analytics" className="font-medium cursor-pointer">Analyses avancées (IA, ML)</Label>
                    <p className="text-xs text-gray-500">Pour utiliser l'IA et le ML dans vos analyses</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bouton de recommandation */}
          <div className="flex justify-center pt-4">
            <Button 
              onClick={generateRecommendation} 
              className="bg-bleu hover:bg-bleu-fonce text-white px-8 py-6 text-lg rounded-full transition-all transform hover:scale-105"
            >
              Recommander une licence
            </Button>
          </div>
        </div>
      ) : (
        <div className="animate-fade-in">
          {recommendation && <LicenseResult recommendation={recommendation} />}
          <div className="flex justify-center mt-8">
            <Button 
              onClick={handleReset} 
              className="bg-rouge hover:bg-opacity-90 text-white px-6 py-2 rounded-full"
            >
              Nouvelle recommandation
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LicenseAdvisor;
