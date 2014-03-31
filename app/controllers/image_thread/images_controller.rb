module ImageThread
  class ImagesController < ::ApplicationController
    def create
      image = ImageThread::Image.new do |img|
        img.name      = params[:name] || params[:source].original_filename
        img.thread_id = params[:thread] || nil #uploader_thread!
        img.source    = params[:source]
        img.dir       = params[:dir] # Add check file exists?
        img.state     = Image::STATE_NEW
      end

      image.save

      render json: {files: [{id: image.id, state: Image::STATE_ACTIVE, url: image.source.url, thumbnailUrl: image.source.url, name: image.name}]}
    end

    private

    def uploader_thread
      uploader_id = params[:uploader]
      session[uploader_id].try(:[], :thread)
    end

    def uploader_thread!
      thread_id = params[:thread] || uploader_thread

      if thread_id.blank?
        thread_id = ImageThread::Thread.create.id
        session[params[:uploader]] = {thread: thread_id}
      end

      thread_id
    end
  end
end
