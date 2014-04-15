module ImageThreadHelper
  def render_image_thread(thread_id, input_name, params = {})
    view  = params[:view]   || 'common'
    return if thread_id.blank?
    images = ImageThread::Image.where(thread_id: thread_id, state: ImageThread::Image::STATE_ACTIVE)
    render "image_thread/shared/#{view}", images: images, input_name: input_name
  end
end