$(document).ready(function () {
    fetchandShowProductsTable();
   
});


$("#add-product-form").submit(function (e) {

    e.preventDefault();

    //var form = new FormData(this); 
    var form = $(this);
    var url = form.attr("action");

    $.ajax({
        type: "POST",
        url: url,
        data: form.serialize(),
        success: function (data) {
            if (data == 1) {
                showSweetAlert("Perfect!", "Product has been successfully added", "success");
                fetchandShowProductsTable();
                $("#id,#name,#description,#price").val("");
            } else {
                showSweetAlert("Oops!", "An error occurred", "error");
            }
        }
    });


});


//functions
function fetchandShowProductsTable() {
    $("#products-section").empty();
    $.ajax({
        url: "/getProducts",
        type: "GET",
        cache: false,
        success: function (data) {
            $("#products-section").append(data);
            $('#products-table').DataTable();
        }

    });
}

function showSweetAlert(alertTitle, alertText, alertIcon) {
    swal({
        title: alertTitle,
        text: alertText,
        icon: alertIcon,
    });
}

function updateProduct(id) {
    alert(id);
}