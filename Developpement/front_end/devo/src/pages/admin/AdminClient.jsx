import { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import {AdminClient} from  '../../api/services'

export default function AdminClients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    AdminClient.getAll('/admin/clients')
      .then(res => setClients(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Gestion des Clients</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Nom</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Date d'inscription</th>
              <th className="px-4 py-3 text-center">Commandes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={4} className="p-4 text-center">Chargement...</td></tr>
            ) : clients.map(client => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{client.nom} {client.prenom}</td>
                <td className="px-4 py-3 text-gray-500">{client.email}</td>
                <td className="px-4 py-3 text-gray-500">{client.created_at}</td>
                <td className="px-4 py-3 text-center font-bold">{client.nb_commandes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}