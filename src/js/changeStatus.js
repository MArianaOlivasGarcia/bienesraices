

(function() {

    const btns = document.querySelectorAll('.btnChangeStatus');
    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');


    btns.forEach( btn => {
        btn.addEventListener('click', async ( e ) => {
            const { propertyId } = e.target.dataset;

            const resp = await fetch(`/property/status/${propertyId}`, {
                method: 'PUT',
                headers: {
                    'CSRF-Token': token
                }
            })

            const { statusProperty } = await resp.json();

            if ( statusProperty ) {
                    e.target.classList.add('bg-green-100', 'text-green-800')
                    e.target.classList.remove('bg-yellow-100', 'text-yellow-800')
                    e.target.textContent = 'Publicado'
                } else {
                    e.target.classList.remove('bg-green-100', 'text-green-800')
                    e.target.classList.add('bg-yellow-100', 'text-yellow-800')
                    e.target.textContent = 'No publicado'
            }


        })
    });


})()