<?php

namespace App\Http\Controllers;

use App\Events\ProcessMenssage as EventsProcessMenssage;
use App\Http\Requests\MessagesRequest;
use App\Jobs\ProcessMenssage;
use App\Models\Message;
use App\Models\User;
use Carbon\Carbon;
use Symfony\Component\HttpFoundation\Response as HttpFoundationResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    /**
     * Exibir uma lista de mensagens.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $messages = Message::all();
        return response()->json($messages);
    }

     /**
     * Exibir uma lista de mensagens.
     */

    public function listMessages($to){
        $from = Auth::user();
        $messages = Message::findContents($to,$from->id);
        return response()->json($messages ,  HttpFoundationResponse::HTTP_OK);
    }

    /**
     * Armazenar uma nova mensagem.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(MessagesRequest $request)
    {
        $validatedData = $request->validated();
        $message = Message::create($validatedData);
        $message->formatted_date = Carbon::now()->format('d/m/Y H:i');
        $auth = Auth::user();

        broadcast(new EventsProcessMenssage($message , $auth->id))->toOthers();
        return response()->json($message,  HttpFoundationResponse::HTTP_OK);
    }
    public function processMenssage(){
        $auth = Auth::user();
        $response = ProcessMenssage::dispatch($auth->id);
        return response()->json($response);
    }

}
