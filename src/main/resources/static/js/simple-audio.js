if(!$.event.special.destroyed){
	(function($){
	  $.event.special.destroyed = {
	    remove: function(o) {
	      if (o.handler) {
	        o.handler()
	      }
	    }
	  }
	})(jQuery);
}

var SimpleAudio=function(params){
	this.element=params.element;
	this.audio=new Audio(params.src);
	this.play=false;
	// this.playImg=params.playImg;
	// this.pauseImg=params.pauseImg;
	this.setPlay=params.setPlay;
	this.setPause=params.setPause;


	var self=this;

	$(this.audio).on('loadeddata',function(){
		// $(self.element).attr('src',self.playImg);
		self.setPlay();
	});
	$(this.audio).on('play',function(){
		// $(self.target).attr('src',self.pauseImg);
		self.setPause();
		self.play=true;
	});
	$(this.audio).on('pause',function(){
		self.setPlay();
		// $(self.target).attr('src',self.playImg);
		self.play=false;
	});

	$(this.element).on('click',function(e){
		self.target=e.target;
		if(!self.play){
			self.audio.play();
		}else{
			self.audio.pause();
		}
	});

	$(this.element).on('click',function(){
		self.element=null;
	});

	$(this.element).on('destroyed',function(){
		self.audio.pause();
		$(self.audio).off('loadeddata');
		$(self.audio).off('pause');
		$(self.audio).off('play');
		$(self.element).off('click');
		self.audio=null;
		self.element=null;
		self.target=null;
	});
};