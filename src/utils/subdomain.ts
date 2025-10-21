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
  const host = window.location.hostname;
  const parts = host.split('.');
  
  // For local development (localhost, 127.0.0.1, etc.)
  if (host === 'localhost' || host === '127.0.0.1' || host.includes('localhost:')) {
    // Check for subdomain in URL params for local testing
    const urlParams = new URLSearchParams(window.location.search);
    const tenantParam = urlParams.get('tenant');
    
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
    const { data, error } = await supabase
      .from('tenants')
      .select('id')
      .eq('subdomain', subdomain)
      .eq('status', 'active')
      .single();
    
    return !error && !!data;
  } catch (error) {
    console.error('Error validating tenant:', error);
    return false;
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
