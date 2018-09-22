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

    llenarTabla();
    var idG='';
    var rutaG='';
    $('#email_asignador').val(localStorage.USUARIO);



    $('#btn-crear').on('click', store);
    $('#btn-actualizar').on('click', update);
    $('#tabla-registros').on('click','.btn-editar', editar);
    $('#btn-nuevo').on('click', crear);
    $('#tabla-registros').on('click','.btn-eliminar', eliminar);
    $('#btn-quitar').on('click', destroy);
    $('#ruta_asignada').on('change', cambiarRuta);
    $('#rutaM').on('change', cambiarRuta);


    //Funciones Puente
    function editar( e ){
        e.preventDefault();
        rutaG=$(this).data('rutaN');
        console.log('Rutav: '+rutaG);
        idG = $(this).data('id');
        llenarRutas('rutaM',$(this).data('ruta'));
        $('#usuarioM').val( $(this).data('usuario') );
        $('#correoN').val( $(this).data('email') );
        console.log(  $(this).data('ruta')  );
        console.log(  $(this).data('usuario')  );
    };

    function crear( e ){
        e.preventDefault();
        llenarRutas('ruta_asignada','');
        $('#email_').val('');
    };


    function eliminar( e ){
        e.preventDefault();
        idG = $(this).data('id');
        $('#rutaE').text( $(this).data('ruta') );
        $('#usuarioE').text( $(this).data('usuario') );
    };

    function llenarRutas(objeto,contenido){
        $('.rutas').remove();
        $('#loader').show();
        $.ajax({
            url:        'ws/gac/codigos/consulta',
            type:       'GET',
            dataType:   'json',
        }).done(function(data){ 
            if( data.result ){
                cont = 0;
                $('#'+objeto).append('<option class="rutas" value="">Seleccionar ruta</option>');
                $.each( data.records.tipo_rutas, function( index,valor ){
                    if( contenido==valor.id )
                        $('#'+objeto).append('<option class="rutas" selected="selected" value="'+valor.id+'">'+valor.id+' - '+valor.valor+'</option>');
                    else
                        $('#'+objeto).append('<option class="rutas" value="'+valor.id+'">'+valor.id+' - '+valor.valor+'</option>');
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


    function cambiarRuta(e){
        e.preventDefault();
        var id = $(this).val();
        $('#loader').show('');

        $.ajax({
            url:        'ws/gac/codigos/consulta',
            type:       'GET',
            dataType:   'json',
        }).done(function(data){ 
            if( data.result ){
                $.each( data.records.tipo_rutas, function( index,valor ){
                    if( id == valor.id ){
                        rutaG=valor.valor;
                        console.log('Rutav: '+rutaG);
                    }

                    if( index == (data.records.tipo_rutas,length - 1))
                        $('#loader').fadeOut('');
                });

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
            url:        'ws/gac/asignar/rutas',
            type:       'GET',
            dataType:   'json',
        }).done(function(data){ 
            if( data.result )
            {
                cont = 0;
                $.each( data.records, function( index,valor ){
                    Col1=(index+1);
                    Col2=valor.nombre;
                    Col7=valor.email;
                    Col4=valor.ruta_asignada+' - '+valor.ruta_asignada_nombre;
                    Col5='<a data-placement="top" title="Editar la ruta del usuario" class="toltip btn-editar btn btn-success btn-xs" href="#modal-editar" data-toggle="modal" data-rutaN="'+valor.ruta_asignada_nombre+'" data-id="'+valor.id+'" data-email="'+valor.email+'" data-ruta="'+valor.ruta_asignada+'"  data-usuario="'+valor.nombre+'"><i class="fa fa-pencil"></i></a>'+
                        ' <a data-placement="top" title="Eliminar la ruta al usuario" class="toltip btn-eliminar btn btn-danger btn-xs" href="#modal-eliminar" data-toggle="modal" data-rutaN="'+valor.ruta_asignada_nombre+'" data-id="'+valor.id+'" data-email="'+valor.email+'" data-ruta="'+valor.ruta_asignada+'"  data-usuario="'+valor.nombre+'" ><i class="fa fa-trash"></i></a>';
                    window.tablaAreas.row.add([Col1,Col2,Col7,Col4,Col5]).draw(false);
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
                url:        'ws/gac/asignar/rutas',
                dataType:   'json',
                data:       {email_asignador: $('#email_asignador').val(), ruta_asignada: $('#ruta_asignada').val(), email: $('#email_').val(), empid: localStorage.EMPID, ruta_asignada_nombre: rutaG},
            }).done(function(data){
                if( data.result )   {
                    $('#modal-crear').modal('hide'); 
                    toastr['success'](data.message, 'Éxito');
                    location.reload();
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
            console.log($('#email_asignador').val())
            console.log($('#correoN').val()) 
            console.log($('#rutaM').val())
            console.log(localStorage.EMPID)
            console.log(rutaG)
            $.ajax({
                type:       'PUT',
                url:        'ws/gac/asignar/rutas/'+idG,
                dataType:   'json',
                data:       {email_asignador: $('#email_asignador').val(), email: $('#correoN').val(), ruta_asignada: $('#rutaM').val(), empid: localStorage.EMPID, ruta_asignada_nombre: rutaG},
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
            url:        'ws/gac/asignar/rutas/'+idG,
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