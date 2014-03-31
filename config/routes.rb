Rails.application.routes.draw do
  namespace :image_thread do
    resources :images, only: [:create]
  end
end