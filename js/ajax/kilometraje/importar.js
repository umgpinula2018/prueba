jQuery(document).ready(function ($) {

    Dropzone.autoDiscover = false;
	$('#dropzone').dropzone(
	{
		url:                'ws/kilometraje/importar/teorico',
		autoProcessQueue:   false,
		addRemoveLinks:     true,
		acceptedFiles:      '.xlsx',
		dictDefaultMessage: 'Subir teoricos',
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
            console.log(error);
			var myDropzone = this; 
			var result = JSON.parse(error.xhr.responseText);
			console.log(result);
            toastr['warning'](result.message, 'Envío cancelado');
            myDropzone.processQueue();
		},
	});
})