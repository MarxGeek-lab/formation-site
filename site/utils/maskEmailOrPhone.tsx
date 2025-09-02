export function maskEmail(email: string) {
    // Séparer l'email en deux parties: avant et après '@'
    const [localPart, domain] = email.split('@');
    
    // Garder les deux premiers caractères du local part et masquer le reste
    const maskedLocalPart = localPart.slice(0, 2) + '*'.repeat(3);
    
/*     // Garder la première lettre du domaine et masquer le reste sauf le TLD
    const [domainName, topLevelDomain] = domain.split('.');
    const maskedDomain = domainName[0] + '*'.repeat(domainName.length - 1) + '.' + topLevelDomain;
     */
    return `${maskedLocalPart}@${domain}`;
}
