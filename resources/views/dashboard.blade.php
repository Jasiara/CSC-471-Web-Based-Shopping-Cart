@extends('layouts.app')

@section('content')
    <div id="app" data-page="{{ json_encode($page) }}"></div>
@endsection
