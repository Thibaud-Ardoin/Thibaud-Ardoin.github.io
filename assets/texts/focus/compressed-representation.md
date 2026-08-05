## Background 📚

We showed previously that a prompt can be compressed with a simple aggregation of the internal representation [1]. 
This compression implies that the LLM can understand much denser represenations then the "natural" residual stream.


![overall-pipeline](assets/projects/prompt_compression/prompt_compression_pipeline.png)

From this proof-of-concept work, **two** main question arise:



## 🔍 1. How much information can be compressed ?

Our paper [1] shows that a weighted sum of the residual stream can compress short prompts effectively into a single representation. Extending this work to longer prompts and evaluating their efficiency compared to other prompt compression method is a natural next step. 

The extension to longer prompt could be streight forward by chunking the prompt into smaller pieces that are aggregated together. However, it is not garanteed if this would work for two reasons: (i) the LLM might not be able to decode multiple artificialy dense representations in a row, and (ii) long contexts might lose their coherence if chunked. 
Compared to existing methods, this approach still holds the adventage of being model-agnostic and not requiring minimal training.

### Goal 🎯
```
Improve the effectiveness of our prompt compression method.
```

![sentence-wise-compression](assets/projects/prompt_compression/multi_token_compression.png)


## 🔍 2. What if a trained weighted sum is a better LLM representation ?

Many activation engeneering methods use the last token of a sentence (*the punctuation*) as a global representation of the sentence [2, 3]. 
It is a pretty good approximation as the last token tends to act as a summery of the information of the sentence.
Nevertheless, this is not an engeneered representation and it is not guaranteed that no information will be left out. For example, a question mark could be linked to the tone of the sentence, rather then the content.

We show in [1] that the weighted sum has a strong potential to interpret the encoding of a prompt in the LLM in two ways: 
(i) By construction it gives a weight to each token of the input according to its importance to reconstruct the overall semantic. This mimics feature attribution methods.
(ii) The extracted compressed representation can be used as a more accurate representation of the prompt for downstream tasks.
The activation engeneering pipelines could gain in accuracy if their representation extraction is improved. 


### Goal 🎯
```
Show usability of W-MLP as an interpretability and activation engeneering tool.
```


![interpretability-compression](assets/projects/prompt_compression/compression_interpretability.png)

## References

[1] *Prompt Compression via Activation Aggregation* Ardoin, et. al (2026) Under review. https://arxiv.org/abs/2607.08399

[2] *LLM Self-Recognition: Steering and Retrieving Activation Signatures* Ardoin, et. al (2026) ICML'26: https://arxiv.org/abs/2606.06315

[3] *Where Confabulation Lives: Latent Feature Discovery in LLMs* Ardoin, et. al (2026) EMNLP'26: https://aclanthology.org/2025.emnlp-main.1515/