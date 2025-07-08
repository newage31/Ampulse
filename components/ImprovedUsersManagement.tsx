import React, { useState, useEffect, useMemo } from 'react';
import { useRolePermissions } from '../hooks/useRolePermissions';
import UserFilters from './ui/user-filters';
import BulkActionsToolbar from './ui/bulk-actions-toolbar';
import UserCard from './ui/user-card';
import Sidebar from './ui/sidebar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  User, 
  Shield, 
  BarChart3, 
  Settings,
  Save,
  X,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Building2
} from 'lucide-react';

interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  role: string;
  statut: 'actif' | 'inactif';
  hotelId?: number;
  dateCreation: string;
  derniereConnexion?: string;
}

interface Role {
  id: number;
  nom: string;
  description: string;
  couleur: string;
  icon: string;
  niveau: number;
}

interface Hotel {
  id: number;
  nom: string;
}

export default function ImprovedUsersManagement() {
  // États principaux
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  // États pour les filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedHotel, setSelectedHotel] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // États pour les sidebars
  const [showUserSidebar, setShowUserSidebar] = useState(false);
  const [showRoleSidebar, setShowRoleSidebar] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // Hook permissions
  const { permissions, checkUserPermission } = useRolePermissions();

  // Chargement des données
  useEffect(() => {
    loadUsers();
    loadRoles();
    loadHotels();
  }, []);

  const loadUsers = async () => {
    try {
      // Simulation de chargement - à remplacer par l'API Supabase
      const mockUsers: User[] = [
        {
          id: 1,
          nom: 'Dupont',
          prenom: 'Jean',
          email: 'jean.dupont@hotel.com',
          telephone: '01 23 45 67 89',
          role: 'admin',
          statut: 'actif',
          hotelId: 1,
          dateCreation: '2023-01-15',
          derniereConnexion: '2024-01-20'
        },
        {
          id: 2,
          nom: 'Martin',
          prenom: 'Sophie',
          email: 'sophie.martin@hotel.com',
          telephone: '01 98 76 54 32',
          role: 'manager',
          statut: 'actif',
          hotelId: 1,
          dateCreation: '2023-03-10',
          derniereConnexion: '2024-01-19'
        }
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    }
  };

  const loadRoles = async () => {
    try {
      const mockRoles: Role[] = [
        { id: 1, nom: 'Admin', description: 'Administrateur système', couleur: '#DC2626', icon: '👑', niveau: 4 },
        { id: 2, nom: 'Manager', description: 'Gestionnaire', couleur: '#2563EB', icon: '👨‍💼', niveau: 3 },
        { id: 3, nom: 'Comptable', description: 'Responsable comptable', couleur: '#059669', icon: '💼', niveau: 2 },
        { id: 4, nom: 'Réceptionniste', description: 'Agent de réception', couleur: '#7C3AED', icon: '🏨', niveau: 1 }
      ];
      setRoles(mockRoles);
    } catch (error) {
      console.error('Erreur lors du chargement des rôles:', error);
    }
  };

  const loadHotels = async () => {
    try {
      const mockHotels: Hotel[] = [
        { id: 1, nom: 'Grand Hotel Paris' },
        { id: 2, nom: 'Boutique Hotel Lyon' }
      ];
      setHotels(mockHotels);
    } catch (error) {
      console.error('Erreur lors du chargement des hôtels:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrage des utilisateurs
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = !searchQuery || 
        `${user.prenom} ${user.nom}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.telephone && user.telephone.includes(searchQuery));

      const matchesRole = !selectedRole || user.role === selectedRole;
      const matchesStatus = !selectedStatus || user.statut === selectedStatus;
      const matchesHotel = !selectedHotel || user.hotelId?.toString() === selectedHotel;

      const matchesDateRange = (!dateRange.start || user.dateCreation >= dateRange.start) &&
                              (!dateRange.end || user.dateCreation <= dateRange.end);

      return matchesSearch && matchesRole && matchesStatus && matchesHotel && matchesDateRange;
    });
  }, [users, searchQuery, selectedRole, selectedStatus, selectedHotel, dateRange]);

  // Gestionnaires d'événements
  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(filteredUsers.map(user => user.id));
  };

  const handleDeselectAll = () => {
    setSelectedUsers([]);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedRole('');
    setSelectedStatus('');
    setSelectedHotel('');
    setDateRange({ start: '', end: '' });
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowUserSidebar(true);
  };

  const handleViewUserDetails = (user: User) => {
    setEditingUser(user);
    setShowUserSidebar(true);
  };

  const handleToggleUserStatus = async (userId: number) => {
    try {
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, statut: user.statut === 'actif' ? 'inactif' : 'actif' }
          : user
      ));
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        setUsers(prev => prev.filter(user => user.id !== userId));
        setSelectedUsers(prev => prev.filter(id => id !== userId));
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  // Actions en masse
  const handleBulkActivate = async () => {
    try {
      setUsers(prev => prev.map(user => 
        selectedUsers.includes(user.id) 
          ? { ...user, statut: 'actif' }
          : user
      ));
      setSelectedUsers([]);
    } catch (error) {
      console.error('Erreur lors de l\'activation en masse:', error);
    }
  };

  const handleBulkDeactivate = async () => {
    try {
      setUsers(prev => prev.map(user => 
        selectedUsers.includes(user.id) 
          ? { ...user, statut: 'inactif' }
          : user
      ));
      setSelectedUsers([]);
    } catch (error) {
      console.error('Erreur lors de la désactivation en masse:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedUsers.length} utilisateur(s) ?`)) {
      try {
        setUsers(prev => prev.filter(user => !selectedUsers.includes(user.id)));
        setSelectedUsers([]);
      } catch (error) {
        console.error('Erreur lors de la suppression en masse:', error);
      }
    }
  };

  const handleBulkEmail = () => {
    const selectedEmails = users
      .filter(user => selectedUsers.includes(user.id))
      .map(user => user.email)
      .join(';');
    
    window.open(`mailto:?bcc=${selectedEmails}`);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowUserSidebar(true);
  };

  const handleImportUsers = () => {
    // Ouvrir dialogue d'import
    console.log('Import users');
  };

  const handleExportUsers = () => {
    // Exporter les utilisateurs en CSV
    console.log('Export users');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Barre d'outils principale */}
      <BulkActionsToolbar
        selectedUsers={selectedUsers}
        totalUsers={filteredUsers.length}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onBulkActivate={handleBulkActivate}
        onBulkDeactivate={handleBulkDeactivate}
        onBulkDelete={handleBulkDelete}
        onBulkEmail={handleBulkEmail}
        onAddUser={handleAddUser}
        onImportUsers={handleImportUsers}
        onExportUsers={handleExportUsers}
      />

      {/* Filtres */}
      <UserFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedHotel={selectedHotel}
        onHotelChange={setSelectedHotel}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        roles={roles.map(role => ({ value: role.nom.toLowerCase(), label: role.nom, count: users.filter(u => u.role === role.nom.toLowerCase()).length }))}
        hotels={hotels.map(hotel => ({ value: hotel.id.toString(), label: hotel.nom, count: users.filter(u => u.hotelId === hotel.id).length }))}
        totalUsers={users.length}
        filteredUsers={filteredUsers.length}
        onClearFilters={handleClearFilters}
      />

      {/* Contenu principal */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="liste" className="h-full flex flex-col">
          <TabsList className="mx-6 mt-4">
            <TabsTrigger value="liste" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Liste des utilisateurs
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Gestion des rôles
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistiques
            </TabsTrigger>
          </TabsList>

          <TabsContent value="liste" className="flex-1 overflow-auto p-6">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
                <p className="text-gray-500 mb-4">
                  {users.length === 0 
                    ? "Aucun utilisateur n'a été créé pour le moment."
                    : "Aucun utilisateur ne correspond aux filtres sélectionnés."
                  }
                </p>
                <Button onClick={handleAddUser}>
                  Ajouter un utilisateur
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredUsers.map(user => (
                  <UserCard
                    key={user.id}
                    user={user}
                    hotelName={hotels.find(h => h.id === user.hotelId)?.nom}
                    roleDefinition={roles.find(r => r.nom.toLowerCase() === user.role)}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                    onToggleStatus={handleToggleUserStatus}
                    onViewDetails={handleViewUserDetails}
                    isSelected={selectedUsers.includes(user.id)}
                    onSelect={handleSelectUser}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="roles" className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {roles.map(role => (
                <div
                  key={role.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setEditingRole(role);
                    setShowRoleSidebar(true);
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                      style={{ backgroundColor: role.couleur }}
                    >
                      {role.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{role.nom}</h3>
                      <p className="text-sm text-gray-500">{role.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <Badge variant="outline">
                      Niveau {role.niveau}
                    </Badge>
                    <span className="text-gray-500">
                      {users.filter(u => u.role === role.nom.toLowerCase()).length} utilisateur{users.filter(u => u.role === role.nom.toLowerCase()).length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stats" className="flex-1 overflow-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par rôle</h3>
                {roles.map(role => {
                  const count = users.filter(u => u.role === role.nom.toLowerCase()).length;
                  const percentage = users.length > 0 ? (count / users.length) * 100 : 0;
                  return (
                    <div key={role.id} className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">{role.nom}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              backgroundColor: role.couleur, 
                              width: `${percentage}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statuts</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Actifs</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {users.filter(u => u.statut === 'actif').length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Inactifs</span>
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      {users.filter(u => u.statut === 'inactif').length}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>Utilisateurs créés ce mois : 2</div>
                  <div>Dernière connexion : Jean Dupont</div>
                  <div>Utilisateurs actifs : {users.filter(u => u.statut === 'actif').length}</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Sidebars */}
      <Sidebar
        isOpen={showUserSidebar}
        onClose={() => setShowUserSidebar(false)}
        title={editingUser ? `Modifier ${editingUser.prenom} ${editingUser.nom}` : 'Nouvel utilisateur'}
      >
        <UserForm
          user={editingUser}
          roles={roles}
          hotels={hotels}
          onSave={() => {
            setShowUserSidebar(false);
            loadUsers();
          }}
          onCancel={() => setShowUserSidebar(false)}
        />
      </Sidebar>

      <Sidebar
        isOpen={showRoleSidebar}
        onClose={() => setShowRoleSidebar(false)}
        title={editingRole ? `Modifier le rôle ${editingRole.nom}` : 'Nouveau rôle'}
      >
        <RoleForm
          role={editingRole}
          onSave={() => {
            setShowRoleSidebar(false);
            loadRoles();
          }}
          onCancel={() => setShowRoleSidebar(false)}
        />
      </Sidebar>
    </div>
  );
}

// Composant formulaire utilisateur
function UserForm({ 
  user, 
  roles, 
  hotels, 
  onSave, 
  onCancel 
}: { 
  user: User | null; 
  roles: Role[]; 
  hotels: Hotel[];
  onSave: () => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState({
    prenom: user?.prenom || '',
    nom: user?.nom || '',
    email: user?.email || '',
    telephone: user?.telephone || '',
    role: user?.role || '',
    statut: user?.statut || 'actif',
    hotelId: user?.hotelId?.toString() || ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, ajouter la logique de sauvegarde
    console.log('Sauvegarde utilisateur:', formData);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prénom *
          </label>
          <Input
            value={formData.prenom}
            onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom *
          </label>
          <Input
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Mail className="h-4 w-4 inline mr-1" />
          Email *
        </label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Phone className="h-4 w-4 inline mr-1" />
          Téléphone
        </label>
        <Input
          value={formData.telephone}
          onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Shield className="h-4 w-4 inline mr-1" />
          Rôle *
        </label>
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Sélectionner un rôle</option>
          {roles.map(role => (
            <option key={role.id} value={role.nom.toLowerCase()}>
              {role.icon} {role.nom}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Building2 className="h-4 w-4 inline mr-1" />
          Établissement
        </label>
        <select
          value={formData.hotelId}
          onChange={(e) => setFormData({ ...formData, hotelId: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Aucun établissement spécifique</option>
          {hotels.map(hotel => (
            <option key={hotel.id} value={hotel.id.toString()}>
              {hotel.nom}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          <Settings className="h-4 w-4 inline mr-1" />
          Statut
        </label>
        <select
          value={formData.statut}
          onChange={(e) => setFormData({ ...formData, statut: e.target.value as 'actif' | 'inactif' })}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="actif">Actif</option>
          <option value="inactif">Inactif</option>
        </select>
      </div>

      {!user && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mot de passe temporaire
          </label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Généré automatiquement"
              readOnly
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Un mot de passe temporaire sera envoyé par email à l'utilisateur
          </p>
        </div>
      )}

      <div className="flex gap-3 pt-6 border-t">
        <Button type="submit" className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          {user ? 'Mettre à jour' : 'Créer l\'utilisateur'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Annuler
        </Button>
      </div>
    </form>
  );
}

// Composant formulaire rôle
function RoleForm({ 
  role, 
  onSave, 
  onCancel 
}: { 
  role: Role | null; 
  onSave: () => void; 
  onCancel: () => void; 
}) {
  const [formData, setFormData] = useState({
    nom: role?.nom || '',
    description: role?.description || '',
    couleur: role?.couleur || '#6B7280',
    icon: role?.icon || '👤',
    niveau: role?.niveau || 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sauvegarde rôle:', formData);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nom du rôle *
        </label>
        <Input
          value={formData.nom}
          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <Input
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Icône
          </label>
          <Input
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Couleur
          </label>
          <input
            type="color"
            value={formData.couleur}
            onChange={(e) => setFormData({ ...formData, couleur: e.target.value })}
            className="w-full h-10 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Niveau d'autorisation (1-4)
        </label>
        <Input
          type="number"
          min="1"
          max="4"
          value={formData.niveau}
          onChange={(e) => setFormData({ ...formData, niveau: parseInt(e.target.value) })}
        />
      </div>

      <div className="flex gap-3 pt-6 border-t">
        <Button type="submit" className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          {role ? 'Mettre à jour' : 'Créer le rôle'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Annuler
        </Button>
      </div>
    </form>
  );
} 