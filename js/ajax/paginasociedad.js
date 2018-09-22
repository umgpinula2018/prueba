jQuery( document ).ready( function( $ ){

		var idregistro = 0;
		var ideliminar = 0;
		
	window.tablaPaginasSociedad = $("#tabla-registros").DataTable(
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
	llenarSociedades('#form-editar #editSociedad');
	//llenarAreasEdit();
	
	function llenarTabla(){
		
		$("#loader").show();
		window.tablaPaginasSociedad.clear().draw();

		$.ajax({
			url:		'ws/perfil/paginasociedad',
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
					counter2 = value.sociedad;
					counter3 = value.pagina;			
					counter4 = '<a class="btn-verlogo btn btn-info btn-xs" href="#modal-verlogo" data-toggle="modal" data-ideditar="'+value.id+'"><i class="fa fa-eye"></i></a>'
							  +'<a style="margin-left:5px;" class="btn-editar btn btn-success btn-xs" href="#modal-editar" data-toggle="modal" data-ideditar="'+value.id+'"><i class="fa fa-pencil"></i></a>'
							  +'<a style="margin-left:5px;" class="btn-eliminar btn btn-danger btn-xs" href="#modal-eliminar" data-toggle="modal" data-ideliminar="'+value.id+'"><i class="fa fa-trash-o "></i></a>';
					window.tablaPaginasSociedad.row.add([counter1,counter2,counter3,counter4]).draw(false);
					
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

	//--------------------------------------------SELECT AREAS-------------------------------------------
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

//------------------------------------------------------------ MOSTRAR DATOS PARA EDITAR ---------------------------------

	$("#tabla-registros").on('click','.btn-editar', function( e )
	{
		e.preventDefault();						
		idregistro = $(e.target).closest("a").data("ideditar");
	    $.ajax({
	        type: "GET",
	        url : "ws/perfil/paginasociedad/"+idregistro,
	        success : function( result )
        	{        		
				if( result.result )
				{	$('#form-editar #previewlogo').html("");
		            $('#form-editar #editSociedad').val(result.records.sociedad).trigger("change");
		            $("#form-editar #editPagina").val(result.records.pagina);   
		            $("#form-editar #previewlogo").append("<center><img src='"+result.records.logo+"' width='130' height='80' /></center><br>")             
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

//-------------------------------------------------------------- MOSTRAR LOGO DE LA PAGINA --------------------------
	$("#tabla-registros").on('click','.btn-verlogo', function( e )
	{
		e.preventDefault();						
		idregistro = $(e.target).closest("a").data("ideditar");
	    $.ajax({
	        type: "GET",
	        url : "ws/perfil/paginasociedad/"+idregistro,
	        success : function( result )
        	{        		
				if( result.result )
				{
					$("#imagenlogo").html("");
					$("#imagenlogo").append("<center><img src='"+result.records.logo+"' width='320' height='170'/></center>");           
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
			var formData = new FormData($("#form-crear")[0]);
			$.ajax(
			{
				type: 		'POST',
				url: 		'ws/perfil/paginasociedad',
				data: 		formData,
            	async: false,
            	cache: false,
            	contentType: false,
            	processData: false,
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
						console.log(formData);
						toastr['error']('Ocurrió un problema, intenta más tarde - aqui', 'Error');
					}
			});
		}
	}

	function update( e )
	{
		e.preventDefault();
		if( $('#form-editar').valid() )
		{
			var formData = new FormData($("#form-editar")[0]);
			$.ajax
			({
				type: 		'POST',
				url: 		'ws/perfil/paginasociedadupdate/'+idregistro,
				data: 		formData,
            	async: false,
            	cache: false,
            	contentType: false,
            	processData: false,
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
			url:	'ws/perfil/paginasociedad/'+ideliminar,
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
