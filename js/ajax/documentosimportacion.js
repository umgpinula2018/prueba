jQuery( document ).ready( function( $ ){

	Dropzone.autoDiscover = false;
	$('#dropzone').dropzone({

		url:                'ws/documentos/constancia/importar',
		autoProcessQueue:   false,
		addRemoveLinks:     true,
		acceptedFiles:      'application/pdf',
		// Mensajes 
		dictDefaultMessage: 'Subir constancias',
		dictRemoveFile:     'Cancelar',
		dictCancelUpload:   'Cancelar Envio',
		dictResponseError:  'No Envio',

		init: function() {
            var myDropzone = this;

            $("#btn-cargar").on("click", function(e) {
                var files = $('#dropzone').get(0).dropzone.getAcceptedFiles();
                e.preventDefault();
                e.stopPropagation();
                myDropzone.processQueue(); 
            });
            $("#btn-eliminar").on("click", function(e) {
                var files = $('#dropzone').get(0).dropzone.getAcceptedFiles();
                $.each(files,function(index,value){
					myDropzone.removeFile(value);
                });
            });                                             
        },
        success: function (file)
		{ 
			var myDropzone = this;
			var result = JSON.parse(file.xhr.responseText);
			toastr['success'](result.message, 'Exito');
			myDropzone.removeFile(file);
			myDropzone.processQueue();
		},
		error: function (error)
		{
			var myDropzone = this; 
			var result = JSON.parse(error.xhr.responseText);
            toastr['warning'](result.message, 'Envío cancelado');
            myDropzone.processQueue();
		},
	});

})