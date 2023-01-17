(function() {

    const lat = 20.67444163271174;
    const lng = -103.38739216304566;

    const mapa = L.map('mapaInicio').setView([lat, lng], 13);


    let markers = new L.FeatureGroup().addTo(mapa);

    let properties = [];


    // FILTERS

    const filters = {
        category: '',
        price: ''
    }


    const categorySelected = document.querySelector('#inputCategories');
    const priceSelected = document.querySelector('#inputPrice');

    categorySelected.addEventListener('change', ( e ) => {
        filters.category = +e.target.value;
        filterProperties();
    })

    priceSelected.addEventListener('change', ( e ) => {
        filters.price = +e.target.value;
        filterProperties();
    })

    // END FILTERS



    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);



    const getProperties = async() => {

        try {
            
            const resp = await fetch('/api/properties');
            const data = await resp.json();

            properties = data.properties;

            showProperties( properties );

        } catch (error) {
            console.log(error)
        }

    }   


    const showProperties = ( properties ) => {

        // Limpiar marcadores anteriores
        markers.clearLayers();

        properties.forEach( property => {

            const marker = new L.marker([property?.lat, property?.lng], {
                autoPan: true
            }).addTo(mapa).bindPopup(`
                <p class="text-indigo-600 font-bold">${ property.category.title }</p>
                <h1 class="text-lg font-extrabold uppercase my-2">${ property.title }</h1>
                <img src="/uploads/${property.image}" alt="${property.title}" />
                <p class="text-gray-600 font-bold">${property.price.title}</p>
                <a href="/property/details/${property.id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase">Ver Propiedad</a>
            `)

            markers.addLayer(marker);

        });

    }

    const filterProperties = () => {
        const propertiesFilters = properties
            .filter( property => {
                return filters.category ? property.category.id == filters.category : property;
            })
            .filter( property => {
                return filters.price ? property.price.id == filters.price : property;
            })  
        
        showProperties(propertiesFilters)
    }
         

    
    getProperties();


})()