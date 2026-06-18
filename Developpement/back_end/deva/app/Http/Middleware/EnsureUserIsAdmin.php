<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next)
{
    if ($request->user() && $request->user()->role === 'admin') {
        return $next($request);
    }

    return response()->json(['message' => 'Accès non autorisé.'], 403);
}
}
