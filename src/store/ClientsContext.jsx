import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'clients';

const ClientsContext = createContext({
	clients: [],
	saveClient: async () => {},
	deleteClient: async () => {},
	loadClients: () => {},
});

export const ClientsProvider = ({ children }) => {
	const [clients, setClients] = useState([]);

	const loadClients = useCallback(() => {
		try {
			if (typeof window === 'undefined') return;
			
			const raw = localStorage.getItem(STORAGE_KEY);
			const parsed = raw ? JSON.parse(raw) : [];
			setClients(Array.isArray(parsed) ? parsed : []);
		} catch (error) {
			console.error('Error cargando clientes desde localStorage:', error);
			setClients([]);
		}
	}, []);

	useEffect(() => {
		loadClients();
	}, [loadClients]);

	const persist = (list) => {
		try {
			if (typeof window === 'undefined') return false;
			localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
			return true;
		} catch (error) {
			console.error('Error guardando clientes en localStorage:', error);
			return false;
		}
	};

	const normalizeClient = (data, id) => {
		const tipoCliente = data.tipoCliente || data.tipo || 'operaciones';
		return {
			id,
			nombre: (data.nombre || '').trim(),
			apellido: (data.apellido || '').trim(),
			telefono: (data.telefono || '').trim(),
			email: (data.email || '').trim(),
			dni: (data.dni || '').trim(),
			direccion: (data.direccion || '').trim(),
			tipoCliente,
		};
	};

	const saveClient = async (clientData) => {
		const isUpdate = !!clientData.id;
		const id = isUpdate ? clientData.id : Date.now();
		const newClient = normalizeClient(clientData, id);
		setClients(prev => {
			const next = [...prev];
			const idx = next.findIndex(c => c.id === id);
			if (idx >= 0) {
				next[idx] = { ...next[idx], ...newClient };
			} else {
				next.push(newClient);
			}
			persist(next);
			return next;
		});
		return newClient;
	};

	const deleteClient = async (id) => {
		setClients(prev => {
			const next = prev.filter(c => c.id !== id);
			persist(next);
			return next;
		});
		return { success: true };
	};

	return (
		<ClientsContext.Provider value={{ clients, saveClient, deleteClient, loadClients }}>
			{children}
		</ClientsContext.Provider>
	);
};

export const useClients = () => useContext(ClientsContext);