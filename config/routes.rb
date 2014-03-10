Rails.application.routes.draw do
  namespace :image_thread do
    resources :images
    resources :threads
  end
end