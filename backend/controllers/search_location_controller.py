from typing import NamedTuple
from flask import Blueprint, jsonify
from sqlalchemy import text
from extensions import db

search_location_blueprint = Blueprint("search_location", __name__)


class SearchInformation(NamedTuple):
    country_name: str
    abbreviation: str
    capital_city: str
    largest_city: str


def is_subsequence(search_term: str, text: str) -> int:
    search_term = search_term.lower()
    text = text.lower()
    if search_term in text:
        return len(search_term)
    search_term_length = len(search_term)
    text_length = len(text)
    search_term_index = 0
    text_index = 0
    while search_term_index < search_term_length and text_index < text_length:
        if search_term[search_term_index] == text[text_index]:
            search_term_index += 1
        text_index += 1
    if search_term_index < search_term_length:
        return 0
    return 1


@search_location_blueprint.route(
    "/search_location/<string:search_term>", methods=["GET"]
)
def search_location(search_term: str):
    exact_matches: list[SearchInformation] = db.session.execute(
        text(
            """ SELECT 
                    Name AS country_name,
                    Abbreviation AS abbreviation,
                    CapitalCity AS capital_city,
                    LargestCity AS largest_city
                FROM Country
                WHERE MATCH(Name, Abbreviation, CapitalCity, LargestCity) AGAINST(:search_term IN NATURAL LANGUAGE MODE)
                LIMIT 10
            """
        ),
        {"search_term": search_term},
    ).fetchall()  # type: ignore
    if exact_matches:
        results = [
            {
                "countryName": exact_match.country_name,
                "abbreviation": exact_match.abbreviation,
                "capitalCity": exact_match.capital_city,
                "largestCity": exact_match.largest_city,
            }
            for exact_match in exact_matches
        ]
        return jsonify(results), 200
    location_details: list[SearchInformation] = db.session.execute(
        text(
            """ SELECT 
                    Name AS country_name,
                    Abbreviation AS abbreviation,
                    CapitalCity AS capital_city,
                    LargestCity AS largest_city
                FROM Country"""
        )
    ).fetchall()  # type: ignore
    results_with_score: list[tuple[dict[str, str], int]] = []
    for details in location_details:
        score = (
            is_subsequence(search_term, details.country_name)
            + is_subsequence(search_term, details.abbreviation)
            + is_subsequence(search_term, details.capital_city)
            + is_subsequence(search_term, details.largest_city)
        )
        if score > 0:
            results_with_score.append(
                (
                    {
                        "countryName": details.country_name,
                        "abbreviation": details.abbreviation,
                        "capitalCity": details.capital_city,
                        "largestCity": details.largest_city,
                    },
                    score,
                )
            )
    results_with_score.sort(key=lambda x: x[1], reverse=True)
    results = [result[0] for result in results_with_score]
    top_10_results = results[: min(len(results), 10)]
    return jsonify(top_10_results), 200
