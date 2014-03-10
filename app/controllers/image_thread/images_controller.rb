module ImageThread
  class ImagesController < ::ApplicationController
    #before_filter :check_access

    def create
      image = ImageThread::Image.new do |img|
        img.thread_id = uploader_thread!
        img.name      = params[:source].original_filename
        img.source    = params[:source]
        img.state     = :new
      end

      image.save

      render json: {image: {id: image.id, state: image.state}}
    end

    def destroy

    end

    private

    def uploader_thread
      uploader_id = params[:uploader]
      session[uploader_id].try(:[], :thread)
    end

    def uploader_thread!
      thread_id = params[:thread] || uploader_thread

      unless thread_id
        thread_id = ImageThread::Thread.create.id
        session[params[:uploader]] = {thread: thread_id}
      end

      thread_id
    end
  end
end
