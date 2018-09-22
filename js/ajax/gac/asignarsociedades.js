jQuery( document ).ready( function( $ ){
    
    window.tablaAreas = $("#tabla-registros").DataTable({
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

    // Asignaciones de Inicio
    llenarTabla();
    var idG='';
    $('#email_asignador').val(localStorage.USUARIO);

    // Asignaciones de funciones
    $('#btn-crear').on('click', store);
    $('#btn-actualizar').on('click', update);
    $('#tabla-registros').on('click','.btn-editar', editar);
    $('#btn-nuevo').on('click', crear);
    $('#tabla-registros').on('click','.btn-eliminar', eliminar);
    $('#btn-quitar').on('click', destroy);

    //Funciones Puente
    function editar( e ){
        e.preventDefault();
        idG = $(this).data('id');
        llenarSociedades('sociedadM',$(this).data('sociedad'));
        $('#usuarioM').val( $(this).data('usuario') );
    };

    function crear( e ){
        e.preventDefault();
        llenarSociedades('sociedad_asignada','');
        $('#email_').val('');
    };

    function eliminar( e ){
        e.preventDefault();
        idG = $(this).data('id');
        $('#sociedadE').text( $(this).data('sociedad') );
        $('#usuarioE').text( $(this).data('usuario') );
    };

    function llenarSociedades(objeto,contenido){
        $('.sociedades').remove();
        $('#loader').show();
        $.ajax({
            url:        'ws/sociedades/lista',
            type:       'GET',
            dataType:   'json',
        }).done(function(data){ 
            if( data.result ){
                cont = 0;
                $.each( data.records.TI_SOC.item, function( index,valor ){
                    if( contenido==valor.BUKRS )
                        $('#'+objeto).append('<option class="sociedades" selected="selected" value="'+valor.BUKRS+'">'+valor.BUKRS+' ('+valor.BUTXT+')</option>');
                    else
                        $('#'+objeto).append('<option class="sociedades" value="'+valor.BUKRS+'">'+valor.BUKRS+' ('+valor.BUTXT+')</option>');
                });

                //Estilos
                $('.enabled').css( 'cursor', 'pointer' );
                $('.disabled').css( 'cursor', 'pointer' );
            }
            else
                toastr['error'](data.message, 'Error');
        }).fail(function(err){
            console.log(err);
        }).always( function(){
            $("#loader").fadeOut();
        });     
    }

    // Funciones
    function llenarTabla(){   
        window.tablaAreas.clear().draw();
        $('#loader').show();
        $.ajax({
            url:        'ws/gac/asignar/sociedad',
            type:       'GET',
            dataType:   'json',
        }).done(function(data){ 
            if( data.result )
            {
                cont = 0;
                $.each( data.records, function( index,valor ){ 
                    Col1=(index+1);
                    Col2=valor.nombre;
                    Col3=valor.email.toUpperCase();;
                    Col4=valor.sociedad;
                    Col5=valor.sociedad_asignada;
                    Col6='<a data-placement="top" title="Editar la sociedad del usuario" class="toltip btn-editar btn btn-success btn-xs" href="#modal-editar" data-toggle="modal" data-id="'+valor.id+'" data-sociedad="'+valor.sociedad_asignada+'" data-usuario="'+valor.nombre+'"><i class="fa fa-pencil"></i></a>'+
                        ' <a data-placement="top" title="Eliminar la sociedad al usuario" class="toltip btn-eliminar btn btn-danger btn-xs" href="#modal-eliminar" data-toggle="modal" data-id="'+valor.id+'" data-sociedad="'+valor.sociedad_asignada+'" data-usuario="'+valor.nombre+'" ><i class="fa fa-trash"></i></a>';
                    window.tablaAreas.row.add([Col1,Col2,Col3,Col4,Col5,Col6]).draw(false);
                });

                //Estilos
                $('.enabled').css( 'cursor', 'pointer' );
                $('.disabled').css( 'cursor', 'pointer' );
            }
            else
                toastr['error'](data.message, 'Error');
        }).fail(function(err){
            console.log(err);
        }).always( function(){
            $("#loader").fadeOut();
        });     
    }

    function store( e ){
        e.preventDefault();
        if( $("#form-crear").valid() ){
            $('#loader').show();
            $.ajax({
                type:       'POST',
                url:        'ws/gac/asignar/sociedad',
                dataType:   'json',
                data:       {email_asignador: $('#email_asignador').val(), sociedad_asignada: $('#sociedad_asignada').val(), email: $('#email_').val()},
            }).done(function(data){
                if( data.result )   {
                    $('#modal-crear').modal('hide'); 
                    toastr['success'](data.message, 'Éxito')
                    setTimeout( function(){ amigable(); }, 500);                        
                }else
                    toastr['error'](data.message, 'Error');
            }).fail(function(err){
                console.log( err );
            }).always( function(){
                $("#loader").fadeOut();
            });  
        }
        else
            toastr['warning']('Hacen falta algunos datos', 'Cuidado');
    };

    function update( e ){
        e.preventDefault();
        if( $("#form-editar").valid() ){
            $('#loader').show();
            $.ajax({
                type:       'PUT',
                url:        'ws/gac/asignar/sociedad/'+idG,
                dataType:   'json',
                data:       {email_asignador: $('#email_asignador').val(), sociedad_asignada: $('#sociedadM').val()},
            }).done(function(data){
                if( data.result )   {
                    $('#modal-editar').modal('hide'); 
                    toastr['success'](data.message, 'Éxito')
                    setTimeout( function(){ amigable(); }, 500);                        
                }else
                    toastr['error'](data.message, 'Error');
            }).fail(function(err){
                console.log( err );
            }).always( function(){
                $("#loader").fadeOut();
            });  
        }
        else
            toastr['warning']('Hacen falta algunos datos', 'Cuidado');
    };

    function destroy( e ){
        e.preventDefault();
        $('#loader').show();
        $.ajax({
            type:       'DELETE',
            url:        'ws/gac/asignar/sociedad/'+idG,
            dataType:   'json',
        }).done(function(data){
            if( data.result )   {
                $('#modal-eliminar').modal('hide'); 
                toastr['success'](data.message, 'Éxito')
                setTimeout( function(){ amigable(); }, 500);                        
            }else
                toastr['error'](data.message, 'Error');
        }).fail(function(err){
            console.log( err );
        }).always( function(){
            $("#loader").fadeOut();
        });
    };

});