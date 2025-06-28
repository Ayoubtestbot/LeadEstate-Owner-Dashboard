import fetch from 'node-fetch';

const API_URL = 'https://leadestate-backend-9fih.onrender.com/api';

// Sample properties to restore (similar to what was likely there before)
const sampleProperties = [
  {
    title: "Appartement moderne 3 pièces",
    type: "apartment",
    price: 450000,
    address: "15 Rue de la République",
    city: "Paris",
    surface: 75,
    description: "Magnifique appartement de 3 pièces entièrement rénové, situé dans un quartier prisé. Cuisine équipée, parquet au sol, balcon avec vue dégagée."
  },
  {
    title: "Villa contemporaine avec piscine",
    type: "house",
    price: 850000,
    address: "42 Avenue des Chênes",
    city: "Lyon",
    surface: 180,
    description: "Superbe villa contemporaine de 180m² avec piscine et jardin paysager. 5 chambres, 3 salles de bains, garage double."
  },
  {
    title: "Studio lumineux centre-ville",
    type: "studio",
    price: 180000,
    address: "8 Place du Marché",
    city: "Marseille",
    surface: 28,
    description: "Charmant studio de 28m² en plein centre-ville, entièrement meublé. Idéal investissement locatif ou premier achat."
  },
  {
    title: "Maison de caractère avec jardin",
    type: "house",
    price: 620000,
    address: "23 Rue des Tilleuls",
    city: "Bordeaux",
    surface: 140,
    description: "Belle maison de caractère avec jardin arboré. 4 chambres, cheminée, cave voûtée. Proche commodités."
  },
  {
    title: "Appartement neuf 2 pièces",
    type: "apartment",
    price: 320000,
    address: "56 Boulevard Haussmann",
    city: "Paris",
    surface: 55,
    description: "Appartement neuf dans résidence standing. 2 pièces avec terrasse, parking inclus. Livraison 2024."
  },
  {
    title: "Loft industriel rénové",
    type: "loft",
    price: 480000,
    address: "12 Rue de l'Industrie",
    city: "Lille",
    surface: 95,
    description: "Magnifique loft industriel entièrement rénové. Volumes exceptionnels, poutres apparentes, mezzanine."
  },
  {
    title: "Duplex avec terrasse",
    type: "duplex",
    price: 520000,
    address: "34 Avenue de la Liberté",
    city: "Nice",
    surface: 85,
    description: "Superbe duplex avec grande terrasse vue mer. 3 chambres, 2 salles de bains, climatisation."
  },
  {
    title: "Maison familiale rénovée",
    type: "house",
    price: 380000,
    address: "67 Rue des Écoles",
    city: "Toulouse",
    surface: 120,
    description: "Maison familiale entièrement rénovée. 4 chambres, jardin clos, garage. Proche écoles et transports."
  }
];

async function restorePropertiesData() {
  console.log('🏠 RESTORING PROPERTIES DATA');
  console.log('📊 Adding sample properties to replace lost data...');
  console.log('');
  
  try {
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < sampleProperties.length; i++) {
      const property = sampleProperties[i];
      console.log(`${i + 1}. Creating: ${property.title}`);
      
      try {
        const response = await fetch(`${API_URL}/properties`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(property)
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log(`   ✅ Created successfully (ID: ${result.data.id})`);
          successCount++;
        } else {
          const errorText = await response.text();
          console.log(`   ❌ Failed: ${response.status} - ${errorText}`);
          errorCount++;
        }
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        errorCount++;
      }
    }
    
    console.log('');
    console.log('📊 RESTORATION SUMMARY:');
    console.log(`✅ Successfully created: ${successCount} properties`);
    console.log(`❌ Failed: ${errorCount} properties`);
    
    if (successCount > 0) {
      console.log('');
      console.log('🎉 Properties data has been restored!');
      console.log('📝 Note: This is sample data to replace what was lost');
      console.log('💡 In the future, database changes should preserve existing data');
    }
    
  } catch (error) {
    console.error('❌ Restoration failed:', error.message);
  }
}

console.log('⚠️  IMPORTANT: This script restores sample properties data');
console.log('📝 The original properties were lost due to table recreation');
console.log('🔧 This has been fixed to prevent future data loss');
console.log('');

restorePropertiesData();
