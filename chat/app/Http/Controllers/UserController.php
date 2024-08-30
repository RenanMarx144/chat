<?php

namespace App\Http\Controllers;

use App\Http\Requests\UsersRequest;
use App\Models\User;
use Illuminate\Foundation\Auth\User as AuthUser;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response as HttpFoundationResponse;

class UserController extends Controller
{
    /**
     * Exibir uma lista de usuários.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $auth = Auth::user();
        return response()->json(User::getUsers($auth->id), HttpFoundationResponse::HTTP_OK);
    }
    /**
     * traz os dados de usuário selecionado.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $user = User::find($id);
        return response()->json($user, HttpFoundationResponse::HTTP_OK);
    }
    /**
     * cadastro do usuário.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(UsersRequest $request)
    {
        $validatedData = $request->validated();
        $user = User::create($validatedData);
        return response()->json($user, HttpFoundationResponse::HTTP_OK);
    }

    /**
     * Atualiza os dados de usuário selecionado.
     *
     * @return \Illuminate\Http\JsonResponse
     */

    public function update(UsersRequest $request,$id)
    {
        $user = User::find($id);
        $validatedData = $request->validated();
        $user->update($validatedData);
        return response()->json($user, HttpFoundationResponse::HTTP_OK);
    }
    /**
     * deleta os dados de usuário selecionado.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $user = User::find($id);
        $user->delete();
        return response()->json(HttpFoundationResponse::HTTP_OK);
    }
}
