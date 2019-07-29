class UsersController < ApplicationController
    def index
        @users = User.all
        userRender = @users.map{|user| {id: user.id, name: user.name, money: user.money,games: user.games}}
        render json: userRender
    end
    def show
        @user = User.find(params[:id])
        render json: @user
    end
end
