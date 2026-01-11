
import { useState, useEffect } from 'react';
import { getServices, ServiceItem } from '@/lib/services/layananService';

export function useServices() {
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        async function fetchServices() {
            try {
                const data = await getServices();
                setServices(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }
        fetchServices();
    }, []);

    return { services, loading, error };
}
