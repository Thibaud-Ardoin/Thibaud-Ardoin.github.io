## Background

Steering can be very subtle and encode more than just the high-level features we intended to represent. Encountered example: steering an LLM away from information retrieval caused it to *confabulate* the bios of obscure people (desired outcome), but additionally it made all of the people into influencers (unexpectedly precise confabulation).


In addition, we observe that lengthy prompts can reach the same representation as short prompts:

__Prompt 1__

> *Could you write me a short poem about the sky? 4 verses would be great*

__Prompt 2__

> *poem sky 4 lines*

### Chat GPT answers

| **Prompt 1** *(≃ 16 words)* |  &nbsp;&nbsp;&nbsp;&nbsp; | **Prompt 2** *(≃ 4 words)* |
|---|---|---|
| The sky unfolds in hues so wide,<br>A canvas where the soft clouds glide.<br>At dawn it glows with golden light,<br>At dusk it fades to velvet night. |  | The sky unfolds in hues so bright,<br>A canvas vast of blue and light.<br>Clouds drift softly, free and high,<br>Dreams take flight where echoes lie. |

## Goal 

I study whether the meaning of a prompt can be compressed into a small set of internal layer-wise representations, allowing LLMs to recover complex instructions from far fewer tokens while revealing more about how information is encoded inside the model.