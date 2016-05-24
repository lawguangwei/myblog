var commentPage = 1;
$(function(){
    new WOW().init();
    $('#submit-comment').on('click',function(){
        var content = $('#text-comment').val();
        var blogId = $('#blog-div').attr('blogId');
        if(content == ''){
            alert('请输入评论内容');
        }else{
            $.ajax({
                type:'post',
                url:'/comment/submit',
                data:{'content':content,'blogId':blogId},
                dataType:'json',
                success:function(result){
                    if(result['code'] == '0'){
                        alert('评论成功');
                        $('#text-comment').val('');
                        $('.blog-comment').remove();
                        setComment(1);
                    }
                }
            });
        }
    });

    setComment(1);
    setPages();
});

function setComment(page){
    var blogId = $('#blog-div').attr('blogId');
    $.ajax({
        type:'post',
        url:'/comment/getComments',
        data:{'blogId':blogId,'page':page},
        dataType:'json',
        success:function(result){
            if(result['code'] == '0'){
                $('.blog-comment').remove();
                var comments = result['comments'];
                var i = 1;
                comments.forEach(function(comment){
                    var date = new Date(comment.createDate);
                    var item = '<div class="blog-comment">' +
                        '<p class="text-danger">#'+ ((commentPage-1)*10+i++) +'</p>' +
                        '<label class="text-info">'+comment.userName+'</label>' +
                        '<p class="comment-content">'+comment.content+'</p>' +
                        '<p class="text-warning text-right">'+date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+'' +
                        ' '+ date.getHours() + ':' + date.getMinutes()+':'+date.getSeconds()+'</p>' +
                        '</div>'
                    $('#comment-pane').append(item);
                });
            }
        }
    });
}

function setPages(){
    var blogId = $('#blog-div').attr('blogId');
    $.ajax({
        type:'post',
        url:'/comment/getPages',
        data:{'blogId':blogId},
        dataType:'json',
        success:function(result){
            if(result['code'] == '0'){
                var pages = result['pages'];
                for(var i = 1;i<=pages;i++){
                    if(i == 1){
                        var item = '<li class="active" page="'+i+'"><a>'+i+'</a></li>';
                    }else{
                        var item = '<li page="'+i+'"><a>'+i+'</a></li>';
                    }
                    $('#ul-pagination').append(item);
                    $('#ul-pagination a').off('click');
                    $('#ul-pagination a').on('click',function(){
                        var page = $(this).text();
                        commentPage = page;
                        $('#ul-pagination li').removeClass('active');
                        setComment(page);
                        $(this).parent().addClass('active');
                    });
                }

            }
        }
    });
}
