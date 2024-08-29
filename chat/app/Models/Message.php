<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;

class Message extends Model
{
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * Os atributos que são atribuíveis em massa.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'from',
        'to',
        'content',
    ];

    /**
     * Os atributos que devem ser convertidos para tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
    ];

    /**
     * Relação com o utilizador destinatário.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function userTo()
    {
        return $this->belongsTo(User::class, 'to');
    }

    /**
     * Relação com o utilizador remetente.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function userFrom()
    {
        return $this->belongsTo(User::class, 'from');
    }

    /**
     * [from = $userFrom && to = $userTo]
     * OR
     * [from = $userTo && to = $userFrom]
     * @param mixed $userFrom
     * @param mixed $userTo
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function findContents($userTo, $userFrom)
    {
        return self::where(function ($query) use ($userFrom, $userTo) {
            $query->where([
                'from'=> $userFrom,
                'to' => $userTo
            ]);
        })->orWhere(function ($query) use ($userFrom, $userTo) {
            $query->where([
                'from'=>$userTo,
                'to' => $userFrom,
            ]);
        })->orderBy('created_at', 'ASC')
        ->select('*', DB::raw("DATE_FORMAT(created_at, '%d/%m/%Y %H:%i') as formatted_date"))
        ->get();
    }
}
