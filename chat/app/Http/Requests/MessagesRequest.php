<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MessagesRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Altere conforme necessário
    }

    public function rules()
    {
        return [
            'from' => 'required|integer',
            'to' => 'required|integer',
            'content' => 'required|string',
        ];
    }
    
}
