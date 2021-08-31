lightbox.option({
    'wrapAround': true
});

$.ajax({
    url: "js/photos.json",
    type: "GET",
    dataType: "json",
    success: function(data){
        
        displayImages(data);
    },
    error: function(){
        alert("json not found");
    }
});

function displayImages(data){
   
    let imagesOrder = [];

    if(sessionStorage.getItem("imagesOrder"))
    {
        imagesOrder=sessionStorage.getItem("imagesOrder");
        imagesOrder= imagesOrder.split(',');
    }
    else
    {
        for(i = 0; i < data["photos"].length; i++)
            imagesOrder.push(i);

        $('.toast').toast('show');
        $('#btnDeny').click(function(){
            window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
            $('.toast').toast('hide');
        })

        $('#btnAccept').click(function(){
            $('.toast').toast('hide');
        })
    }

    for(i = 0; i < imagesOrder.length; i++)
        oneImage(data.photos[imagesOrder[i]], imagesOrder[i]);
    
    sessionStorage.setItem("imagesOrder", imagesOrder);

}

function updateOrder(){

    let imagesOrder = [];
    let newOrder = [];
    let storageOrder = sessionStorage.getItem("imagesOrder");
    storageOrder = storageOrder.split(',').map(Number);

    $(".imgLink").each(function(){
        imagesOrder.push($(this).attr("id").replace("img_",""));
    })

    imagesOrder=imagesOrder.map(Number);
  

    if(imagesOrder.length < storageOrder.length)
    {
        let j=0;
        for(i=0; i<storageOrder.length; i++)
        {

            if(imagesOrder.includes(storageOrder[i]))
            {
                newOrder.push(imagesOrder[j++]);
            }
            else
                newOrder.push(storageOrder[i]);
                
        }
        sessionStorage.setItem("imagesOrder", newOrder);
    }
    else
        sessionStorage.setItem("imagesOrder", imagesOrder);
}

function oneImage(image, imgNum){
    
    // Lightbox belongs to this lad: https://lokeshdhakar.com/projects/lightbox2/

    $("#images").append('<li><a href="' + image.src + '" data-lightbox="example-set" class="imgLink" id="img_' + imgNum + '" data-title="' + image.title + "<br>" + image.description + 
        '" data-alt="' + image.title + '"><img src="' + image.src + '"class="img-fluid image"></a></li>');
}

$(document).ready(function(){

    $(".lb-closeContainer").append('<i class="fa fa-play" id="playButton"></i><i class="fa fa-pause" id="stopButton"></i>');
    
    $("#playButton").click(function(){
        var interval = window.setInterval(function(){
            $(".lb-next").click();
            $(".lb-close").click(function(){window.clearInterval(interval)})
            $("#stopButton").click(function(){window.clearInterval(interval)});
          }, 3000);
    });
   
    $("#images").sortable({
    
        stop: function(){
            updateOrder();
        }
    });
    
    oldOrder = sessionStorage.getItem("imagesOrder");
    $("#searchBar").on('input', function(){
        var search = document.getElementById("searchBar");

        imagesOrder=sessionStorage.getItem("imagesOrder");
        imagesOrder= imagesOrder.split(',').map(Number);
       
        $('#images').html("");
        
        
        $.ajax({
            url: "js/photos.json",
            type: "GET",
            dataType: "json",
            success: function(data){
                imgData = data;
               
                for(i=0; i<imagesOrder.length; i++)
                    if(data.photos[imagesOrder[i]].title.toLowerCase().includes(search.value.toLowerCase()) || data.photos[imagesOrder[i]].description.toLowerCase().includes(search.value.toLowerCase()))
                        oneImage(data.photos[imagesOrder[i]], imagesOrder[i]);
            },
            error: function(){
                alert("json not found");
            }
        });  
    })
});