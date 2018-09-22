jQuery( document ).ready( function( $ ){

	var ideditar = 0;
	var ideliminar = 0;
	var idSuspender = 0;
	var idusuario = 0;
	var ideliminarareas = 0;

	window.tablaAdministradores = $("#tabla-registros").DataTable(
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

	window.tablaAreas = $("#tabla-areas").DataTable(
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

	limpia();
	llenarTabla();

	function limpia(){
        $('#form-crear')[0].reset();
		$("#form-crear").validate().resetForm();
        $('#form-crear #email').removeClass('valid');
        $('#form-crear #email').removeClass('error');
    }

    $('#crearRegistro').on('click',function(){ limpia(); });

	
//-----------------------------------------------------FUNCION PARA LLENAR TABLA-------------------------------------
	function llenarTabla(){
		$("#loader").show();
		window.tablaAdministradores.clear().draw();
		$.ajax({
			url:		'ws/documentos/administrador',
			type:		'GET',
			dataType: 	'json',
		})
		.done(function(data){
			if( data.result ){			
				contador = 0;		
				$.each(data.records, function(index,value){
					contador++;
					estado = (value.documentos_aprobador==1?"<span class=\"label label-success\">Activo</span>":"<span class=\"label label-danger\">Suspendido</span>");
					counter1 = contador;
					counter2 = value.nombre;
					counter3 = value.email;
					counter4 = value.depto;
					counter5 = '<center>'+estado+'</center>';
					if (value.documentos_aprobador==1){
							counter6 = '<center><a class="btn-asignar btn btn-primary btn-xs" href="#modal-asignar" data-toggle="modal" data-idusuario="'+value.id+'" title="Asigna un área al aprobador">Asignar área</a>'+
									   '<a style="margin-left:3px;" class="btn-suspender btn btn-primary btn-xs" href="#modal-suspender" data-toggle="modal" data-idsuspender="'+value.id+'" title="Suspende al aprobador"><i class="fa fa-level-down"></i></a>'+
									   '<a style="margin-left:3px;" class="btn-eliminar btn btn-danger btn-xs" href="#modal-eliminar" data-toggle="modal" data-ideliminar="'+value.id+'" title="Elimina al aprobador"><i class="fa fa-times-circle"></i></a></center>';
						}
						else
							if (value.documentos_aprobador==2){
								counter6 = '<center><a class="btn-suspender btn btn-success btn-xs" href="#modal-activar" data-toggle="modal" data-idsuspender="'+value.id+'" title="Activa al aprobador"><i class="fa fa-level-up"></i></a>'+
										   '<a style="margin-left:3px;" class="btn-eliminar btn btn-danger btn-xs" href="#modal-eliminar" data-toggle="modal" data-ideliminar="'+value.id+'" title="Elimina al aprobador"><i class="fa fa-times-circle"></i></a></center>';
							}
					window.tablaAdministradores.row.add([counter1,counter2,counter3,counter4,counter5,counter6]).draw(false);
				});
			}
		})
		.fail(function(err){
			console.log(err);
		})
		.always( function(){
			$("#loader").fadeOut();
		});	
	}

//--------------------------------------------SELECT AREAS-------------------------------------------
	function selectAreas(selector){
		$.ajax(
		{
			type: 		'GET',
			url: 		'ws/documentos/areas',
			dataType: 	'json',
		})
		.done(function( data )
		{
			if( data.result )
			{	
				$(selector).find('option').remove().end();
				$(selector).append($("<option />").val('0').text('Seleccione una sociedad'));
				
				$.each(data.records, function(index, value)
				{
					if(value.estado == 1){
						$(selector).append($("<option />").val(value.id).text(value.sociedad+' - '+value.nombre));
					}
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

//------------------------------------------------ FUNCION PARA ELIMINAR ----------------------------
	$("#tabla-registros").on('click', '.btn-eliminar', function( e ){
		ideliminar = $(e.target).closest("a").data("ideliminar");
	});

//----------------------------------------------- FUNCION PARA SUSPENDER ----------------------------
	$("#tabla-registros").on('click', '.btn-suspender', function( e ){
		idSuspender = $(e.target).closest("a").data("idsuspender");
	});

//----------------------------------------------- FUNCION PARA ASIGNAR ------------------------------
	$("#tabla-registros").on('click', '.btn-asignar', function( e ){
		e.preventDefault();
		llenarTablaAreas($(this).data('idusuario'));
	});

	$("#tabla-areas").on('click', '.btn-eliminararea', function( e ){
		e.preventDefault();
		ideliminarareas = $(e.target).closest("a").data("ideliminararea");
		$.ajax
		({
			type:	"GET",
			url:	'ws/documentos/eliminararea/'+ideliminarareas,
			success: function( result )
			{
				if( result.result )
				{
					idusuario = $('#form-areas #usuario').val();
					llenarTablaAreas(idusuario);
					toastr['success'](result.message, 'Éxito')
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
	});
//-------------------------------------------------------EVENTOS-------------------------------------
	$('#btn-crear').on('click', store);
	$('#btn-agregar-area').on('click',agregarArea);
	$('#btn-eliminar').on('click', destroy);
	$('#btn-suspender').on('click', suspender);
	$('#btn-activar').on('click', suspender);

//----------------------------------------FUNCION PARA LLENAR TABLA DE AREAS ASIGNADAS--------------
	function llenarTablaAreas( idusuario )
	{
		selectAreas('#form-areas #areas');
		$('#form-areas #usuario').val(idusuario);
		window.tablaAreas.clear().draw();
		$.ajax({
			url:		'ws/documentos/usuarios/areas/'+idusuario,
			type:		'GET',
			dataType: 	'json',
		})
		.done(function(data){
			if( data.result ){		
				contador = 0;		
				$.each(data.records, function(index,value){
					contador++;
					counter1 = contador;
					counter2 = value.area.sociedad+' - '+value.area.nombre;
					counter3 = '<center><a style="margin-left:3px;" class="btn-eliminararea btn btn-danger btn-xs" data-ideliminararea="'+value.id+'"><i class="fa fa-times-circle"></i></a></center>';
					window.tablaAreas.row.add([counter1,counter2,counter3]).draw(false);
				});
			}
		})
		.fail(function(err){
			console.log(err);
		})
	}

//----------------------------------------FUNCION PARA CREAR-----------------------------------
	function store( e )
	{
		e.preventDefault();
		if( $( '#form-crear' ).valid() )
		{
			var datos = $('#form-crear').serialize();
			$.ajax(
			{
				type: 		'POST',
				url: 		'ws/documentos/administrador',
				dataType: 	'json',
				data: 		datos,
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
		}
	}

//----------------------------------------FUNCION PARA SUSPENDER ADMIN---------------------------
	function suspender( e )
	{
		e.preventDefault();
		$.ajax
		({
			type: 		'GET',
			url: 		'ws/documentos/suspender/'+idSuspender,
			success: function ( result )
			{
				if( result.result )
				{
					setTimeout( function(){ amigable(); }, 500);  						
					toastr['success'](result.message, 'Éxito')
			        $('#modal-suspender').modal('hide'); 
			        $('#modal-activar').modal('hide'); 
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

//----------------------------------------FUNCION PARA ELIMINAR ADMIN---------------------------
	function destroy( e )
	{
		e.preventDefault();
		$.ajax
		({
			type:	"DELETE",
			url:	'ws/documentos/administrador/'+ideliminar,
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

//----------------------------------------FUNCION ASIGNAR AREAS---------------------------
	function agregarArea( e )
	{
		e.preventDefault();
		if( $( '#form-areas' ).valid() )
		{
			if ($('#areas').val() != 0) {
				var datos = $('#form-areas').serialize();
				$.ajax(
				{
					type: 		'POST',
					url: 		'ws/documentos/asignaradmin',
					dataType: 	'json',
					data: 		datos,
					success: function( result )
						{
							if( result.result )
							{
								idusuario = $('#form-areas #usuario').val();
								llenarTablaAreas(idusuario);
								toastr['success'](result.message, 'Éxito');
							}
							else
							{
								toastr['warning'](result.message, 'Error');
							}
						},
					error: 	function( result )
						{
							toastr['error']('Ocurrió un problema, intenta más tarde', 'Error');
						}
				});
			}else{
				toastr['warning']('Debe de seleccionar un área', 'Sociedad - Área');
			}
		}
	}

});