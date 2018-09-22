jQuery( document ).ready( function( $ ){

		var idregistro = 0;
		var ideliminar = 0;
		var sociedad = "";
		
	window.tablaDocumentos = $("#tabla-registros").DataTable(
	{
		"oLanguage": {
			"sLengthMenu": "Mostrando _MENU_ filas",
			"sSearch": "",
			"sProcessing":     "Procesando...",
			"sLengthMenu":     "Mostrar _MENU_ registros",
			"sZeroRecords":    "No se encontraron resultados",
			"sEmptyTable":     "Ningún dato disponible en esta tabla",
			"sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
			"sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
			"sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
			"sInfoPostFix":    "",
			"sSearch":         "Buscar:",
			"sUrl":            "",
			"sInfoThousands":  ",",
			"sLoadingRecords": "Cargando...",
			"oPaginate": {
				"sFirst":    "Primero",
				"sLast":     "Último",
				"sNext":     "Siguiente",
				"sPrevious": "Anterior"
			}
		}
	});

	llenarTabla();
	llenarSociedades('#form-crear #sociedad');

	function limpia(){
        $('#form-crear')[0].reset();
        $("#form-crear").validate().resetForm();
        $('#nombre')        .removeClass('valid');
        $('#areas')			.removeClass('valid');
        $('#descricipcion') .removeClass('valid');
        $('#nombre')        .removeClass('error');
        $('#areas') 		.removeClass('error');
        $('#descricipcion') .removeClass('error');
        $("#form-editar").validate().resetForm();
        $('#editsociedad')  .removeClass('valid');
        $('#editarea')		.removeClass('valid');
        $('#editnombre')    .removeClass('valid');
        $('#editdescripcion').removeClass('valid');
        $('#editsociedad')  .removeClass('error');
        $('#editarea') 		.removeClass('error');
        $('#editnombre')    .removeClass('error');
        $('#editdescripcion').removeClass('error');
    };

    $('#crearRegistro').on('click',function(){ limpia() });
    $('.btn-editar').on('click',function(){ limpia() });
	
	function llenarTabla(){
		
		$("#loader").show();
		window.tablaDocumentos.clear().draw();

		$.ajax({
			url:		'ws/documentos/tipodocumento',
			type:		'GET',
			dataType: 	'json',
			}
		)
		.done(function(data){	
			if( data.result ){		
				contador = 0;		
				$.each(data.records, function(index,value){
					contador++;
					counter1 = contador;
					counter2 = value.area.sociedad;
					counter3 = value.area.nombre;
					counter4 = value.nombre;
					counter5 = value.descripcion;				
					counter6 = '<a class="btn-editar btn btn-info btn-xs" href="#modal-editar" data-toggle="modal" data-ideditar="'+value.id+'" title="Editar documento"><i class="fa fa-pencil"></i></a>';
						//+'<a style="margin-left:5px;" class="btn-eliminar btn btn-danger btn-xs" href="#modal-eliminar" data-toggle="modal" data-ideliminar="'+value.id+'"><i class="fa fa-trash-o "></i></a>';
					window.tablaDocumentos.row.add([counter1,counter2,counter3,counter4,counter5,counter6]).draw(false);
					
				});
			}
		})
		.fail(function(err){
			console.log(err);
		})
		.always(function(){
			$("#loader").fadeOut();
		});
	};

	//--------------------------------------------------SELECT 2 PARA SOCIEDADES--------------------------------

	function llenarSociedades(selector){
		$.ajax(
		{
			type: 		'GET',
			url: 		'ws/sociedades/lista',
			dataType: 	'json',
		})
		.done(function( data )
		{
			if( data.result )
			{	
				$(selector).find('option').remove().end();
				$(selector).append($("<option />").val('0').text('Seleccione una sociedad'));
				
				$.each(data.records.TI_SOC.item, function(index, value)
				{
					$(selector).append($("<option />").val(value.BUKRS).text(value.BUKRS+' - '+value.BUTXT));
				});
				
				$(selector).select2({ });
			}
			else
				console.log(data.message);
		})
		.fail(function( err )
		{
			console.log( err );
		})
		.always(function() { });
	}

	$('#form-crear #sociedad').change(function(e){
		sociedad = $('#form-crear #sociedad').val();
		llenarareas('#form-crear #areas');
	})

	function llenarareas(selector){
		$.ajax(
		{
			type: 		'GET',
			url: 		'ws/documentos/areasadmin/'+sociedad,
			dataType: 	'json',
		})
		.done(function( data )
		{
			if( data.result )
			{	
				$(selector).find('option').remove().end();
				$(selector).append($("<option />").val('0').text('Seleccione un área'));
				
				$.each(data.records, function(index, value)
				{
					$(selector).append($("<option />").val(value.id).text(value.nombre));
				});
				
				$(selector).select2({ });
			}
			else
				console.log(data.message);
		})
		.fail(function( err )
		{
			console.log( err );
		})
		.always(function() { });
	}

	$("#tabla-registros").on('click','.btn-editar', function( e )
	{
		limpia();
		e.preventDefault();						
		idregistro = $(e.target).closest("a").data("ideditar");
	    $.ajax({
	        type: "GET",
	        url : "ws/documentos/tipodocumento/"+idregistro,
	        success : function( result )
        	{        		
				if( result.result )
				{
					$("#form-editar #editsociedad").val(result.records.area.sociedad);
		            $("#form-editar #editarea").val(result.records.area.nombre);
		            $("#form-editar #editnombre").val(result.records.nombre);
		            $("#form-editar #editdescripcion").val(result.records.descripcion);		            
          		}
		  		else
		  		{
					toastr['error'](result.message, 'Error');
	            	$("#modal-editar").modal('hide'); 
	          	}      
	          
	        },
	        error: function( data )
        	{
				toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
        	}
		});
	});

	$("#tabla-registros").on('click', '.btn-eliminar', function( e ){
		ideliminar = $(e.target).closest("a").data("ideliminar");
	});

//------------------eventos------------------------------------

	$('#btn-crear').on('click', store);
	$('#btn-editar').on('click', update);
	$('#btn-eliminar').on('click', destroy);

//---------------función crear----------------------------------
	

	function store( e )
	{
		e.preventDefault();
		if( $( '#form-crear' ).valid() )
		{
			if ($('#sociedad').val() != 0 && $('#areas').val() != 0 ) {		
				$.ajax(
				{
					type: 		'POST',
					url: 		'ws/documentos/tipodocumento',
					dataType: 	'json',
					data: 		$('#form-crear').serialize(),
					success: function( result )
						{
							if( result.result )
							{
								$('#modal-crear').modal('hide');
								toastr['success'](result.message, 'Éxito');
								setTimeout( function(){ amigable(); }, 500);  
							}
							else
							{
								toastr['error'](result.message, 'Error');
							}
						},
					error: 	function( result )
						{
							toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
						}
				});
			}else{
				toastr['warning']('Debes de seleccionar una sociedad y area', 'Error');
			}
		}
	}

	function update( e )
	{
		e.preventDefault();
		if( $('#form-editar').valid() )
		{
			$.ajax
			({
				type: 		'PUT',
				url: 		'ws/documentos/tipodocumento/'+idregistro,
				dataType: 	'json',
				data: 		$('#form-editar').serialize(),
				success: function ( result )
				{
					if( result.result )
					{
						setTimeout( function(){ amigable(); }, 500);  						
						toastr['success'](result.message, 'Éxito')
				        $('#modal-editar').modal('hide'); 
					}
					else
					{
						toastr['error'](result.message, 'Error');
					}
				},
				error: function ( result )
				{
					toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
				}
			});
		}
	}

	function destroy( e )
	{
		e.preventDefault();
		$.ajax
		({
			type:	"DELETE",
			url:	'ws/documentos/tipodocumento/'+ideliminar,
			success: function( result )
			{
				if( result.result )
				{
					toastr['success'](result.message, 'Éxito')
					setTimeout( function(){ amigable(); }, 500);  
					$("#modal-eliminar").modal('hide');
				}
				else
				{
					toastr['error'](result.message, 'Error');
				}
			},
			error: function( result )
			{
				toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
			}
		});
	}
	


});
