// Shared UI components across the site

export function formatPrice(price) {
  if (!price) return 'Price on request';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
}

export function formatStatus(status) {
  if (!status) return '';
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function listingCardHTML(l) {
  const specs = [];
  if (l.bedrooms != null) specs.push(`${l.bedrooms} BD`);
  if (l.bathrooms != null) specs.push(`${l.bathrooms} BA`);
  if (l.square_feet != null) specs.push(`${l.square_feet.toLocaleString()} SQFT`);
  if (l.lot_size) specs.push(l.lot_size.toUpperCase());
  const addr = [l.address, l.city, l.state].filter(Boolean).join(', ');
  const statusLabel = formatStatus(l.status);

  const photoHTML = l.image_urls && l.image_urls[0]
    ? `<img src="${l.image_urls[0]}" alt="Photo of ${l.address || 'property'}" style="width:100%; height:100%; object-fit:cover;">`
    : '<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:var(--paper-dim); color:var(--ink-soft);">No photo available</div>';

  return `
    <a href="listing.html?id=${l.id}" class="listing-card survey-frame" style="text-decoration:none; color:inherit; display:block;">
      <div class="listing-photo">${photoHTML}</div>
      <div class="status">${statusLabel}</div>
      <div class="price">${formatPrice(l.price)}</div>
      <div class="addr">${addr || ''}</div>
      <div class="specs">${specs.map((s) => `<span>${s}</span>`).join('')}</div>
    </a>`;
}
