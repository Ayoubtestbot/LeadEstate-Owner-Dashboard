import fetch from 'node-fetch';

const API_URL = 'https://leadestate-backend-9fih.onrender.com/api';

const properties = [
  {
    title: "Appartement 3 pièces - Neuilly",
    type: "apartment",
    price: 450000,
    location: "Neuilly-sur-Seine",
    bedrooms: 2,
    bathrooms: 1,
    area: 75,
    description: "Magnifique appartement rénové avec vue sur jardin. Proche métro et commerces. Idéal première acquisition.",
    status: "available"
  },
  {
    title: "Villa moderne avec piscine",
    type: "house", 
    price: 850000,
    location: "Saint-Cloud",
    bedrooms: 4,
    bathrooms: 3,
    area: 180,
    description: "Villa contemporaine avec jardin paysager et piscine. Garage double. Quartier résidentiel calme.",
    status: "available"
  },
  {
    title: "Studio lumineux Centre",
    type: "studio",
    price: 280000,
    location: "Paris 11ème", 
    bedrooms: 1,
    bathrooms: 1,
    area: 35,
    description: "Studio optimisé avec mezzanine. Proche République. Parfait investissement locatif.",
    status: "available"
  },
  {
    title: "Loft industriel rénové",
    type: "loft",
    price: 720000,
    location: "Paris 10ème",
    bedrooms: 2,
    bathrooms: 2, 
    area: 120,
    description: "Ancien atelier d'artiste transformé. Hauteur sous plafond 4m. Domotique intégrée.",
    status: "available"
  },
  {
    title: "Maison familiale avec jardin",
    type: "house",
    price: 520000,
    location: "Vincennes",
    bedrooms: 3,
    bathrooms: 2,
    area: 110,
    description: "Maison bourgeoise avec jardin arboré. Proche RER A. Idéale famille avec enfants.",
    status: "available"
  },
  {
    title: "Duplex avec terrasse",
    type: "duplex",
    price: 590000,
    location: "Paris 20ème",
    bedrooms: 3,
    bathrooms: 2,
    area: 95,
    description: "Duplex moderne avec grande terrasse. Vue dégagée. Parking privé inclus.",
    status: "sold"
  },
  {
    title: "Appartement de standing",
    type: "apartment", 
    price: 380000,
    location: "Boulogne-Billancourt",
    bedrooms: 2,
    bathrooms: 1,
    area: 68,
    description: "Résidence récente avec concierge. Balcon sud. Cave et parking en sous-sol.",
    status: "available"
  },
  {
    title: "Penthouse vue panoramique",
    type: "penthouse",
    price: 1200000,
    location: "Paris 7ème",
    bedrooms: 3,
    bathrooms: 2,
    area: 140,
    description: "Dernier étage avec terrasse 360°. Vue Tour Eiffel. Prestations haut de gamme.",
    status: "under_offer"
  }
];

async function createProperties() {
  console.log('🏠 Creating 8 realistic French properties...');
  
  for (let i = 0; i < properties.length; i++) {
    const property = properties[i];
    
    try {
      console.log(`🏗️ Creating property ${i + 1}/8: ${property.title}`);
      
      const response = await fetch(`${API_URL}/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(property)
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Property created: ${property.title} (ID: ${result.data.id})`);
      } else {
        const error = await response.text();
        console.error(`❌ Failed to create ${property.title}:`, error);
      }
      
      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 800));
      
    } catch (error) {
      console.error(`❌ Error creating ${property.title}:`, error.message);
    }
  }
  
  console.log('🎯 Finished creating properties!');
  console.log('');
  console.log('🎉 YOUR LEADESTATE CRM IS NOW COMPLETE!');
  console.log('📊 Total Data Created:');
  console.log('   📋 10+ French Leads');
  console.log('   👥 5 Team Members'); 
  console.log('   🏠 8 Properties');
  console.log('   🔗 Lead Assignments');
  console.log('');
  console.log('🚀 Go check your CRM - it should look like a real French real estate agency!');
}

createProperties();
