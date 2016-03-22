$(function(){
    var ue = UE.getEditor('container');

    $('#commit-btn').on('click',function(){
        var title = $('#title').val();
        var content = ue.getContent();
        var collection = $('#collection').val();
        var type = $(':radio[name="type"]:checked').val();

        if(title == ''){
            alert('请完成标题');
        }else{
            writeBlog(title,content,collection,type);
        }
    });
})

function writeBlog(title,content,collection,type){
    $.ajax({
        type:'post',
        url:'/blog/write',
        data:{title:title,content:content,collection:collection,type:type},
        dataType:'json',
        success:function(result){
            if(result['code'] == '0'){
                alert('博文已保存!');
                location.href='/blog';
            }else{
                alert('博文保存失败');
            }
        }
    });
}