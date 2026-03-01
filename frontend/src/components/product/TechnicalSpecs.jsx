import React from 'react';

const SPEC_LABELS = {
    display: 'Display',
    processor: 'Processor',
    ram: 'RAM',
    storage: 'Storage',
    battery: 'Battery',
    camera: 'Camera',
    os: 'OS',
    front_camera: 'Front Camera',
    connectivity: 'Connectivity',
    sim_type: 'SIM Type',
    dimensions: 'Dimensions',
    weight: 'Weight',
    colors: 'Colors',
    charging: 'Charging',
    fingerprint: 'Fingerprint',
    nfc: 'NFC',
    water_resistance: 'Water Resistance',
};

const TechnicalSpecs = ({ specs }) => {
    if (!specs || Object.keys(specs).length === 0) {
        return (
            <div className="py-8 text-center text-gray-400 text-sm font-medium">
                Specifications not available for this product.
            </div>
        );
    }

    // Normalise: specs may be an object {key: val} or an array [{spec_name, spec_value}]
    let rows = [];
    if (Array.isArray(specs)) {
        rows = specs.map(s => ({ label: s.spec_name, value: s.spec_value }));
    } else {
        rows = Object.entries(specs).map(([k, v]) => ({
            label: SPEC_LABELS[k] || k.replace(/_/g, ' '),
            value: v,
        }));
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-100">
            <table className="w-full">
                <tbody>
                    {rows.map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 text-sm font-black text-navy uppercase tracking-wide w-40 align-top">
                                {row.label}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-700">
                                {row.value || '—'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TechnicalSpecs;
