"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ReportGenerator, sampleData } from '../../utils/reportGenerator';
import ReportCharts from '../features/ReportCharts';
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  Building2, 
  Users, 
  Euro,
  BarChart3,
  PieChart,
  Filter,
  Search,
  RefreshCw,
  Printer,
  Mail,
  Target,
  Award,
  Activity,
  Eye,
  Settings,
  Code,
  Clock
} from 'lucide-react';

interface ReportData {
  id: string;
  title: string;
  description: string;
  type: 'reservations' | 'revenue' | 'occupancy' | 'clients' | 'hotels';
  period: string;
  generatedAt: string;
  status: 'ready' | 'generating' | 'error';
  format: 'pdf' | 'excel';
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface ReportsPageProps {
  hotels?: Array<{ id: number; nom: string }>;
  selectedHotelId?: number | null;
}

export default function ReportsPage({ hotels = [], selectedHotelId }: ReportsPageProps) {
  const [activeTab, setActiveTab] = useState<'rapports' | 'analyses' | 'graphiques'>('rapports');
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedHotel, setSelectedHotel] = useState<string>(selectedHotelId ? selectedHotelId.toString() : 'all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [selectedChartType, setSelectedChartType] = useState<'reservations' | 'revenue' | 'occupancy' | 'clients' | 'hotels'>('reservations');
  const [reports, setReports] = useState<ReportData[]>([
    {
      id: '1',
      title: 'Rapport mensuel des réservations',
      description: 'Analyse complète des réservations du mois de janvier 2024',
      type: 'reservations',
      period: 'Janvier 2024',
      generatedAt: '2024-01-25 14:30',
      status: 'ready',
      format: 'pdf'
    },
    {
      id: '2',
      title: 'Analyse des revenus Q4 2023',
      description: 'Rapport détaillé des revenus du 4ème trimestre 2023',
      type: 'revenue',
      period: 'Q4 2023',
      generatedAt: '2024-01-20 09:15',
      status: 'ready',
      format: 'excel'
    },
    {
      id: '3',
      title: 'Taux d\'occupation par établissement',
      description: 'Comparaison des taux d\'occupation entre établissements',
      type: 'occupancy',
      period: 'Décembre 2023',
      generatedAt: '2024-01-15 16:45',
      status: 'ready',
      format: 'pdf'
    }
  ]);

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'reservations',
      name: 'Rapport des Réservations',
      description: 'Analyse détaillée des réservations avec statistiques',
      icon: <Calendar className="h-6 w-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'revenue',
      name: 'Rapport Financier',
      description: 'Analyse des revenus et rentabilité',
      icon: <Euro className="h-6 w-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'occupancy',
      name: 'Taux d\'Occupation',
      description: 'Statistiques d\'occupation par établissement',
      icon: <BarChart3 className="h-6 w-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'clients',
      name: 'Analyse Clients',
      description: 'Profil et comportement des clients',
      icon: <Users className="h-6 w-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'hotels',
      name: 'Performance Hôtels',
      description: 'Comparaison des performances par établissement',
      icon: <Building2 className="h-6 w-6" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  // Utiliser les hôtels passés en props ou une liste par défaut
  const availableHotels = hotels.length > 0 ? hotels : [
    { id: 1, nom: 'Hôtel Central' },
    { id: 2, nom: 'Résidence du Port' },
    { id: 3, nom: 'Château des Alpes' },
    { id: 4, nom: 'Auberge Provençale' },
    { id: 5, nom: 'Hôtel des Arts' }
  ];

  const generateReport = async (templateId: string, format: 'pdf' | 'excel') => {
    setIsGenerating(true);
    
    try {
      if (format === 'pdf') {
        const generator = new ReportGenerator();
        const reportData = {
          title: `${reportTemplates.find(t => t.id === templateId)?.name}`,
          period: selectedPeriod,
          generatedAt: new Date().toLocaleString('fr-FR'),
          type: templateId,
          data: sampleData[templateId as keyof typeof sampleData] || []
        };
        
        const pdfUrl = generator.generateReport(templateId, reportData);
        
        // Créer un lien de téléchargement
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `${reportData.title}_${selectedPeriod}.pdf`;
        link.click();
      }
      
      // Simulation pour Excel (à implémenter plus tard)
      if (format === 'excel') {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      const newReport: ReportData = {
        id: Date.now().toString(),
        title: `${reportTemplates.find(t => t.id === templateId)?.name} - ${selectedPeriod}`,
        description: `Rapport généré pour la période ${selectedPeriod}`,
        type: templateId as any,
        period: selectedPeriod,
        generatedAt: new Date().toLocaleString('fr-FR'),
        status: 'ready',
        format
      };
      
      setReports(prev => [newReport, ...prev]);
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadReport = (report: ReportData) => {
    // Simulation de téléchargement
    const link = document.createElement('a');
    link.href = `data:text/${report.format};charset=utf-8,${encodeURIComponent('Contenu du rapport')}`;
    link.download = `${report.title}.${report.format}`;
    link.click();
  };

  const deleteReport = (reportId: string) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Rapports et Analyses</h2>
          <p className="text-gray-600">Générez et consultez vos rapports détaillés</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowCharts(!showCharts)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {showCharts ? 'Masquer' : 'Afficher'} les graphiques
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Envoyer par email
          </Button>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('rapports')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'rapports'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText className="h-4 w-4 inline mr-2" />
            Rapports
          </button>
          <button
            onClick={() => setActiveTab('analyses')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analyses'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-2" />
            Analyses
          </button>
          <button
            onClick={() => setActiveTab('graphiques')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'graphiques'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <PieChart className="h-4 w-4 inline mr-2" />
            Graphiques
          </button>
        </nav>
      </div>

      {/* Contenu spécifique à chaque onglet */}
      {activeTab === 'rapports' && (
        <>
          {/* Filtres pour les rapports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filtres de génération
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Période
                  </label>
                  <select 
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value as any)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="week">Cette semaine</option>
                    <option value="month">Ce mois</option>
                    <option value="quarter">Ce trimestre</option>
                    <option value="year">Cette année</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Établissement
                  </label>
                  <select 
                    value={selectedHotel}
                    onChange={(e) => setSelectedHotel(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Tous les établissements</option>
                    {availableHotels.map(hotel => (
                      <option key={hotel.id} value={hotel.id}>
                        {hotel.nom}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-end">
                  <Button 
                    onClick={() => generateReport('reservations', 'pdf')}
                    disabled={isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Générer un rapport
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Graphiques interactifs */}
          {showCharts && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Graphiques interactifs</h3>
                <div className="flex space-x-2">
                  <select 
                    value={selectedChartType}
                    onChange={(e) => setSelectedChartType(e.target.value as any)}
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="reservations">Réservations</option>
                    <option value="revenue">Revenus</option>
                    <option value="occupancy">Occupation</option>
                    <option value="clients">Clients</option>
                    <option value="hotels">Hôtels</option>
                  </select>
                </div>
              </div>
              <ReportCharts type={selectedChartType} period={selectedPeriod} />
            </div>
          )}

          {/* Templates de rapports */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Types de rapports disponibles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reportTemplates.map((template) => (
                <Card key={template.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${template.bgColor}`}>
                        <div className={template.color}>
                          {template.icon}
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <p className="text-sm text-gray-600">{template.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => generateReport(template.id, 'pdf')}
                        disabled={isGenerating}
                        className="flex-1"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => generateReport(template.id, 'excel')}
                        disabled={isGenerating}
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Excel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'analyses' && (
        <>
          {/* Filtres pour les analyses */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Paramètres d'analyse
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Période d'analyse
                  </label>
                  <select 
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value as any)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="week">Cette semaine</option>
                    <option value="month">Ce mois</option>
                    <option value="quarter">Ce trimestre</option>
                    <option value="year">Cette année</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Établissement
                  </label>
                  <select 
                    value={selectedHotel}
                    onChange={(e) => setSelectedHotel(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">Tous les établissements</option>
                    {availableHotels.map(hotel => (
                      <option key={hotel.id} value={hotel.id}>
                        {hotel.nom}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-end">
                  <Button 
                    onClick={() => {}} // Fonction d'analyse à implémenter
                    className="w-full"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Lancer l'analyse
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Graphiques d'analyse avancée */}
          {showCharts && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Analyses avancées</h3>
                <div className="flex space-x-2">
                  <select 
                    value={selectedChartType}
                    onChange={(e) => setSelectedChartType(e.target.value as any)}
                    className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="reservations">Tendances</option>
                    <option value="revenue">Comparaisons</option>
                    <option value="occupancy">Prévisions</option>
                    <option value="clients">Segmentation</option>
                    <option value="hotels">Performance</option>
                  </select>
                </div>
              </div>
              <ReportCharts type={selectedChartType} period={selectedPeriod} />
            </div>
          )}

          {/* Types d'analyses disponibles */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Types d'analyses disponibles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  id: 'trends',
                  name: 'Analyse des Tendances',
                  description: 'Évolution des indicateurs clés dans le temps',
                  icon: <TrendingUp className="h-6 w-6" />,
                  color: 'text-blue-600',
                  bgColor: 'bg-blue-50'
                },
                {
                  id: 'comparison',
                  name: 'Analyse Comparative',
                  description: 'Comparaison entre établissements et périodes',
                  icon: <BarChart3 className="h-6 w-6" />,
                  color: 'text-green-600',
                  bgColor: 'bg-green-50'
                },
                {
                  id: 'prediction',
                  name: 'Prévisions',
                  description: 'Modèles prédictifs pour les réservations futures',
                  icon: <Target className="h-6 w-6" />,
                  color: 'text-purple-600',
                  bgColor: 'bg-purple-50'
                },
                {
                  id: 'segmentation',
                  name: 'Segmentation Clients',
                  description: 'Analyse des profils et comportements clients',
                  icon: <Users className="h-6 w-6" />,
                  color: 'text-orange-600',
                  bgColor: 'bg-orange-50'
                },
                {
                  id: 'performance',
                  name: 'Analyse de Performance',
                  description: 'Évaluation des performances par métrique',
                  icon: <Award className="h-6 w-6" />,
                  color: 'text-indigo-600',
                  bgColor: 'bg-indigo-50'
                },
                {
                  id: 'anomalies',
                  name: 'Détection d\'Anomalies',
                  description: 'Identification des patterns inhabituels',
                  icon: <Activity className="h-6 w-6" />,
                  color: 'text-red-600',
                  bgColor: 'bg-red-50'
                }
              ].map((analysis) => (
                <Card key={analysis.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${analysis.bgColor}`}>
                        <div className={analysis.color}>
                          {analysis.icon}
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-base">{analysis.name}</CardTitle>
                        <p className="text-sm text-gray-600">{analysis.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {}} // Fonction d'analyse à implémenter
                      className="w-full"
                    >
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Lancer l'analyse
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'graphiques' && (
        <>
          {/* Graphiques interactifs dédiés */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Visualisations graphiques</h3>
              <div className="flex space-x-2">
                <select 
                  value={selectedChartType}
                  onChange={(e) => setSelectedChartType(e.target.value as any)}
                  className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="reservations">Réservations</option>
                  <option value="revenue">Revenus</option>
                  <option value="occupancy">Occupation</option>
                  <option value="clients">Clients</option>
                  <option value="hotels">Hôtels</option>
                </select>
              </div>
            </div>
            <ReportCharts type={selectedChartType} period={selectedPeriod} />
          </div>

          {/* Outils de graphiques */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Outils de visualisation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  id: 'export',
                  name: 'Exporter Graphique',
                  description: 'Sauvegarder les graphiques en PNG, SVG ou PDF',
                  icon: <Download className="h-6 w-6" />,
                  color: 'text-blue-600',
                  bgColor: 'bg-blue-50'
                },
                {
                  id: 'customize',
                  name: 'Personnaliser',
                  description: 'Modifier les couleurs, styles et options',
                  icon: <Settings className="h-6 w-6" />,
                  color: 'text-green-600',
                  bgColor: 'bg-green-50'
                },
                {
                  id: 'share',
                  name: 'Partager',
                  description: 'Partager les graphiques par email ou lien',
                  icon: <Mail className="h-6 w-6" />,
                  color: 'text-purple-600',
                  bgColor: 'bg-purple-50'
                },
                {
                  id: 'embed',
                  name: 'Intégrer',
                  description: 'Code d\'intégration pour sites web',
                  icon: <Code className="h-6 w-6" />,
                  color: 'text-orange-600',
                  bgColor: 'bg-orange-50'
                },
                {
                  id: 'schedule',
                  name: 'Planifier',
                  description: 'Génération automatique de rapports',
                  icon: <Clock className="h-6 w-6" />,
                  color: 'text-indigo-600',
                  bgColor: 'bg-indigo-50'
                },
                {
                  id: 'compare',
                  name: 'Comparer',
                  description: 'Comparaison de graphiques côte à côte',
                  icon: <BarChart3 className="h-6 w-6" />,
                  color: 'text-red-600',
                  bgColor: 'bg-red-50'
                }
              ].map((tool) => (
                <Card key={tool.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${tool.bgColor}`}>
                        <div className={tool.color}>
                          {tool.icon}
                        </div>
                      </div>
                      <div>
                        <CardTitle className="text-base">{tool.name}</CardTitle>
                        <p className="text-sm text-gray-600">{tool.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {}}
                      className="w-full"
                    >
                      Utiliser
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Contenu spécifique à chaque onglet - Rapports générés et Analyses récentes */}
      {activeTab === 'rapports' && (
        <>
          {/* Rapports générés */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rapports récents</h3>
            <div className="space-y-4">
              {reports.map((report) => (
                <Card key={report.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${
                          report.type === 'reservations' ? 'bg-blue-50' :
                          report.type === 'revenue' ? 'bg-green-50' :
                          report.type === 'occupancy' ? 'bg-orange-50' :
                          report.type === 'clients' ? 'bg-purple-50' :
                          'bg-indigo-50'
                        }`}>
                          {report.type === 'reservations' && <Calendar className="h-5 w-5 text-blue-600" />}
                          {report.type === 'revenue' && <Euro className="h-5 w-5 text-green-600" />}
                          {report.type === 'occupancy' && <BarChart3 className="h-5 w-5 text-orange-600" />}
                          {report.type === 'clients' && <Users className="h-5 w-5 text-purple-600" />}
                          {report.type === 'hotels' && <Building2 className="h-5 w-5 text-indigo-600" />}
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900">{report.title}</h4>
                          <p className="text-sm text-gray-600">{report.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500">Période: {report.period}</span>
                            <span className="text-xs text-gray-500">Généré: {report.generatedAt}</span>
                            <Badge variant="secondary" className="text-xs">
                              {report.format.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => downloadReport(report)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Télécharger
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.print()}
                        >
                          <Printer className="h-4 w-4 mr-1" />
                          Imprimer
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteReport(report.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'analyses' && (
        <>
          {/* Analyses récentes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyses récentes</h3>
            <div className="space-y-4">
              {[
                {
                  id: '1',
                  title: 'Analyse des tendances - Janvier 2024',
                  description: 'Évolution des réservations et revenus sur 6 mois',
                  type: 'trends',
                  period: 'Janvier 2024',
                  generatedAt: '2024-01-25 14:30',
                  status: 'completed'
                },
                {
                  id: '2',
                  title: 'Comparaison établissements - Q4 2023',
                  description: 'Analyse comparative des performances par hôtel',
                  type: 'comparison',
                  period: 'Q4 2023',
                  generatedAt: '2024-01-20 09:15',
                  status: 'completed'
                },
                {
                  id: '3',
                  title: 'Prévisions réservations - Février 2024',
                  description: 'Modèle prédictif pour les réservations du mois prochain',
                  type: 'prediction',
                  period: 'Février 2024',
                  generatedAt: '2024-01-22 16:45',
                  status: 'in_progress'
                }
              ].map((analysis) => (
                <Card key={analysis.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${
                          analysis.type === 'trends' ? 'bg-blue-50' :
                          analysis.type === 'comparison' ? 'bg-green-50' :
                          analysis.type === 'prediction' ? 'bg-purple-50' :
                          analysis.type === 'segmentation' ? 'bg-orange-50' :
                          analysis.type === 'performance' ? 'bg-indigo-50' :
                          'bg-red-50'
                        }`}>
                          {analysis.type === 'trends' && <TrendingUp className="h-5 w-5 text-blue-600" />}
                          {analysis.type === 'comparison' && <BarChart3 className="h-5 w-5 text-green-600" />}
                          {analysis.type === 'prediction' && <Target className="h-5 w-5 text-purple-600" />}
                          {analysis.type === 'segmentation' && <Users className="h-5 w-5 text-orange-600" />}
                          {analysis.type === 'performance' && <Award className="h-5 w-5 text-indigo-600" />}
                          {analysis.type === 'anomalies' && <Activity className="h-5 w-5 text-red-600" />}
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900">{analysis.title}</h4>
                          <p className="text-sm text-gray-600">{analysis.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500">Période: {analysis.period}</span>
                            <span className="text-xs text-gray-500">Généré: {analysis.generatedAt}</span>
                            <Badge variant={analysis.status === 'completed' ? 'secondary' : 'outline'} className="text-xs">
                              {analysis.status === 'completed' ? 'Terminé' : 'En cours'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {}}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Exporter
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {}}
                        >
                          <BarChart3 className="h-4 w-4 mr-1" />
                          Visualiser
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {}}
                          className="text-red-600 hover:text-red-700"
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Statistiques rapides adaptées à chaque onglet */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {activeTab === 'rapports' ? (
          <>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rapports générés</p>
                    <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Download className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Téléchargements</p>
                    <p className="text-2xl font-bold text-gray-900">24</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Printer className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Impressions</p>
                    <p className="text-2xl font-bold text-gray-900">18</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Mail className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Envoyés par email</p>
                    <p className="text-2xl font-bold text-gray-900">8</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Analyses effectuées</p>
                    <p className="text-2xl font-bold text-gray-900">15</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Prévisions générées</p>
                    <p className="text-2xl font-bold text-gray-900">7</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Target className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Précision moyenne</p>
                    <p className="text-2xl font-bold text-gray-900">94%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <Activity className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Anomalies détectées</p>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
} 
