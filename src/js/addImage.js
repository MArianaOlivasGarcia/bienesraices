

import { Dropzone } from 'dropzone'

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

console.log({token})

// image - Id del dropzone
Dropzone.options.image = {
    dictDefaultMessage: 'Sube tus imagenes aquí',
    acceptedFiles: '.png, .jpg, .jpeg',
    maxFilesize: 5,
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: 'Borrar Archivo',
    dictMaxFilesExceeded: 'El limite es 1 archivo',
    headers: {
        'CSRF-Token': token
    },
    paramName: 'fileImage',
    init: function() {
        
        const dropzone = this;
        console.log({dropzone})

        const btnPublish = document.querySelector('#btnAddImage');

        btnPublish.addEventListener('click', function(){
            dropzone.processQueue()
        })


        dropzone.on("queuecomplete", function (file) {
            if(dropzone.getActiveFiles().length == 0) {
                window.location.href = '/my-properties'
            }
        });


    },
    // queuecomplete(){
    // }
}