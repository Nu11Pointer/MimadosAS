// Variables Globales
var rowSelected;
var purchaseTable;
var purchaseObj;

// Evento Document Loaded
document.addEventListener('DOMContentLoaded', function () {
    SetUp();
});

// Función Principal
function SetUp() {
    // Pintar Menu Collapse
    $('#CollapseMenuSupplier').addClass('active');
    $('#collapseSix').addClass('show');
    $('#CollapseMenuItemSupplier').addClass('active');

    // Show DataTable
    Read();

    // Cargar Selectores
    LoadSelectors();

    // Crear Validaciones
    //Validator();
    
    // Establecer Actualizar
    $("#dataTable tbody").on("click", '.btn-update', ShowUpdateModal);

    // Establecer Eliminar
    $("#dataTable tbody").on("click", '.btn-detelete', Delete);
}

function Read() {

    purchaseTable = $('#dataTable').DataTable({
        responsive: true,
        ordering: false,
        "ajax": {
            url: '/Purchase/Read',
            type: "GET",
            dataType: "json"
        },
        "columns": [
            { "data": "Product.Name" },
            { "data": "Supplier.Name" },
            { "data": "Quantity" },
            { "data": "PurchasePrice", "render": value => "C$" + value.toFixed(2)},
            {
                "data": "StringTimeStamp",
                "orderable": false,
                "searchable": false
            },
            {
                "data": "Active", "render": function (value) {
                    if (value)
                        return '<h5><span class="badge badge-success">Habilitado</span></h5>';
                    else
                        return '<h5><span class="badge badge-danger">Deshabilitado</span></h5>';
                }
            },
            {
                "data": "Id", render: function (data, type, row, meta) {
                    var json = JSON.stringify(row);
                    return "<button class='btn btn-sm btn-success' type='button' onclick='invoice(" + json + ")'><i class='fas fa-check'></i></button>"
                },
                "orderable": false,
                "searchable": false
            }
        ],
        "columnDefs": [
        { "width": "18%", "targets": [0, 1] }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
        }
    });
}

function LoadSelectors() {

    // Load Selector Department
    jQuery.ajax({
        url: '/Product/Read',
        type: "GET",
        data: null,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $.each(data.data, function (_index, value) {
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#ProductCreate");
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#ProductUpdate");
            })
        },
        error: function (error) {
            console.log(error);
        }
    });

    // Load Selector Department
    jQuery.ajax({
        url: '/Supplier/Read',
        type: "GET",
        data: null,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $.each(data.data, function (_index, value) {
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#SupplierCreate");
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#SupplierUpdate");
            })
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function ShowCreateModal() {
    $("#ProductCreate").val($("#ProductCreate option:first").val());
    $("#SupplierCreate").val($("#SupplierCreate option:first").val());
    $("#ActiveCreate").val($("#ActiveCreate option:first").val());
    $("#QuantityCreate").val(0);
    $("#PurchasePriceCreate").val(0);
    $("#FormModalCreate").modal("show"); 
    $("#ErrorCreate").hide();
}

function Validator() {
    $("#CreateForm").validate({
        rules: {
            NameCreate: {
                required: true
            }
        },
        messages: {
            NameCreate: "- El campo \"Nombre\" es obligatorio."
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
    });

    $("#UpdateForm").validate({
        rules: {
            NameUpdate: {
                required: true
            }
        },
        messages: {
            NameUpdate: "- El campo \"Nombre\" es obligatorio."
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
    });
}

function Create() {

    if (!$("#CreateForm").valid()) {
        return;
    }

    purchaseObj = {
        "Product": {
            "Id": $("#ProductCreate").val()
        },
        "Supplier": {
            "Id": $("#SupplierCreate").val()
        },
        "Quantity": $("#QuantityCreate").val(),
        "PurchasePrice": $("#PurchasePriceCreate").val(),
        "Active": $("#ActiveCreate").val() == 1 ? true : false
    };

    jQuery.ajax({
        url: '/Purchase/Create',
        type: "POST",
        data: JSON.stringify({ purchase: purchaseObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            purchaseTable.ajax.reload();
            $(".modal-body").LoadingOverlay("hide");
            $("#FormModalCreate").modal("hide");
            if (response.result) {
                purchaseTable.ajax.reload();
            }
            else {
                swal("No Se Logró Crear La Compra.", response.message, "error");
            }
        },
        error: function (error) {
            $(".modal-body").LoadingOverlay("hide");
            $("#ErrorCreate").text(error.responseText);
            $("#ErrorCreate").show();
        },
        beforeSend: function () {

            $(".modal-body").LoadingOverlay("show", {
                imageResizeFactor: 2,
                text: "Cargando...",
                size: 14
            });
        }
    });
}

function ShowUpdateModal() {

    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    purchaseObj = purchaseTable.row(rowSelected).data();

    $("#ProductUpdate").val(purchaseObj.Product.Id);
    $("#SupplierUpdate").val(purchaseObj.Supplier.Id);
    $("#ActiveUpdate").val(purchaseObj.Active ? 1 : 0);
    $("#QuantityUpdate").val(purchaseObj.Quantity);
    $("#PurchasePriceUpdate").val(purchaseObj.PurchasePrice);
    $("#FormModalUpdate").modal("show"); 
    $("#ErrorUpdate").hide();
}

function Update() {

    if (!$("#UpdateForm").valid()) {
        return;
    }

    purchaseObj = {
        "Product": {
            "Id": $("#ProductUpdate").val()
        },
        "Supplier": {
            "Id": $("#SupplierUpdate").val()
        },
        "Quantity": $("#QuantityUpdate").val(),
        "PurchasePrice": $("#PurchasePriceUpdate").val(),
        "StringTimeStamp": purchaseObj.StringTimeStamp,
        "Active": $("#ActiveUpdate").val() == 1 ? true : false
    };

    console.log(purchaseObj);

    jQuery.ajax({
        url: '/Purchase/Update',
        type: "POST",
        data: JSON.stringify({ purchase: purchaseObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {

            $(".modal-body").LoadingOverlay("hide");
            $("#FormModalUpdate").modal("hide");
            if (response.result) {
                purchaseTable.ajax.reload();
            }
            else {
                swal("No Se Logró Actualizar la Compra.", response.message, "error");
            }
        },
        error: function (error) {

            $(".modal-body").LoadingOverlay("hide");
            $("#ErrorUpdate").text(error.responseText);
            $("#ErrorUpdate").show();
        },
        beforeSend: function () {

            $(".modal-body").LoadingOverlay("show", {
                imageResizeFactor: 2,
                text: "Cargando...",
                size: 14
            });
        }
    });
}

function Delete() {

    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    purchaseObj = purchaseTable.row(rowSelected).data();

    swal({
        title: "Eliminar Compra",
        text: "¿Estas Seguro que Deseas Eliminar Esta Compra?",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-primary",
        confirmButtonText: "Si",
        cancelButtonText: "No",
        closeOnConfirm: true
    },
        function () {

            jQuery.ajax({
                url: '/Purchase/Delete',
                type: "POST",
                data: JSON.stringify({ purchase: purchaseObj }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (response) {

                    if (response.result) {
                        purchaseTable.ajax.reload();
                    }
                    else {
                        swal("No Se Logró Eliminar la Compra.", response.message, "error");
                    }
                },
                error: function (error) {
                    console.log(error);
                },
                beforeSend: function () { }
            });

        }
    );
}
