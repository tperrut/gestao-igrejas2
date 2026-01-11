/**
 * Utility functions for multi-tenant subdomain detection
 */

export interface SubdomainInfo {
  isSubdomain: boolean;
  subdomain: string | null;
  isMainDomain: boolean;
}

/**
 * Detects and extracts subdomain information from the current hostname
 * @returns SubdomainInfo with subdomain detection data
 */
export const detectSubdomain = (): SubdomainInfo => {
  // deveria ser uma const
  const host = window.location.hostname;
  const parts = host.split('.');
  
  // For local development (localhost, 127.0.0.1, etc.)
  if (host === 'localhost' || host === '127.0.0.1') {
    // Check for subdomain in URL params for local testing
    const urlParams = new URLSearchParams(window.location.search);
    let tenantParam = urlParams.get('tenant');

    // Optional default tenant for dev (set VITE_DEFAULT_TENANT in .env)
    // Avoid hardcoded tenant in codebase.
    if (!tenantParam && import.meta.env.VITE_DEFAULT_TENANT) {
      tenantParam = String(import.meta.env.VITE_DEFAULT_TENANT);
    }

    if (tenantParam) {
      return {
        isSubdomain: true,
        subdomain: tenantParam,
        isMainDomain: false,
      };
    }

    return {
      isSubdomain: false,
      subdomain: null,
      isMainDomain: true,
    };
  }
  
  // For production (betelhub.com.br or subdomains like imwniteroi.betelhub.com.br)
  // Assuming format: [subdomain.]betelhub.com.br
  const mainDomain = 'betelhub';
  
  if (parts.length >= 3) {
    // Has subdomain (e.g., imwniteroi.betelhub.com.br)
    const subdomain = parts[0];
    
    if (subdomain !== mainDomain && subdomain !== 'www') {
      return {
        isSubdomain: true,
        subdomain,
        isMainDomain: false,
      };
    }
  }
  
  // Main domain (betelhub.com.br or www.betelhub.com.br)
  return {
    isSubdomain: false,
    subdomain: null,
    isMainDomain: true,
  };
};

/**
 * Gets tenant slug from subdomain or URL params
 */
export const getTenantSlug = (): string | null => {
  const subdomainInfo = detectSubdomain();
  return subdomainInfo.subdomain;
};

/**
 * Validates if a tenant exists in the database by subdomain
 */
export const validateTenantExists = async (subdomain: string): Promise<boolean> => {
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    console.log('Validando tenant:', subdomain);
    // Prefer the public view which has a permissive SELECT policy
    const { data, error } = await supabase
      .from('tenant_branding')
      .select('id, subdomain')
      .eq('subdomain', subdomain)
      .single();

    console.log('Resultado da validação:', { data, error });
    return !error && !!data;
  } catch (error) {
    console.error('Error validating tenant:', error);
    return false;
  }
};

/**
 * Fetch tenant branding (with a small localStorage cache and basic error categorization)
 * Returns { status: 'ok'|'not_found'|'error', data?, error? }
 */
export const fetchTenantBranding = async (subdomain: string): Promise<any> => {
  const cacheKey = `tenant_branding_${subdomain}`;
  try {
    const raw = localStorage.getItem(cacheKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.expiresAt && parsed.expiresAt > Date.now()) {
        return { status: 'ok', data: parsed.data, cached: true };
      }
    }
  } catch (e) {
    // ignore cache errors
  }

  try {
    const { supabase } = await import('@/integrations/supabase/client');
    const { data, error } = await supabase
      .from('tenant_branding')
      .select('id, name, subdomain, logo_url')
      .eq('subdomain', subdomain)
      .single();

    if (error) {
      // If Supabase returns 406/500 etc. or network error, bubble as 'error'
      console.error('fetchTenantBranding supabase error:', error);
      // If it's a 406 or no rows, treat as not_found
      if ((error as any).code === 'PGRST116' || (error as any).status === 406) {
        return { status: 'not_found' };
      }
      return { status: 'error', error };
    }

    if (!data) {
      return { status: 'not_found' };
    }

    // store in cache for 5 minutes
    try {
      const expiresAt = Date.now() + 1000 * 60 * 5;
      localStorage.setItem(cacheKey, JSON.stringify({ data, expiresAt }));
    } catch (e) {
      // ignore
    }

    return { status: 'ok', data };
  } catch (err) {
    console.error('fetchTenantBranding network/error:', err);
    return { status: 'error', error: err };
  }
};

/**
 * Checks if current page is on the main domain (landing page)
 */
export const isMainDomain = (): boolean => {
  const subdomainInfo = detectSubdomain();
  return subdomainInfo.isMainDomain;
};

/**
 * Redirects to login with tenant context
 */
export const redirectToLogin = (tenantSlug?: string) => {
  const slug = tenantSlug || getTenantSlug();
  if (slug) {
    window.location.href = `/auth?tenant=${slug}`;
  } else {
    window.location.href = '/auth';
  }
};

/**
 * Redirects to main domain landing page
 */
export const redirectToLandingPage = () => {
  // In production, this would redirect to https://betelhub.com.br
  // For local development, just go to root
  window.location.href = '/';
};
